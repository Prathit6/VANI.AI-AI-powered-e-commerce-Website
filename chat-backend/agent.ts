// Import required modules from LangChain ecosystem
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { z } from "zod";
import "dotenv/config";

// Utility function to handle API rate limits with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.status === 429 && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

// Main agent function - ONLY USES real_products_db
export async function callAgent(client: MongoClient, query: string, thread_id: string) {
  try {
    // Define the state structure for the agent workflow
    const GraphState = Annotation.Root({
      messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
      }),
    });

    // -------------------- TOOL - ONLY real_products_db --------------------
    async function itemLookupToolFunction(args: { query: string; n?: number }) {
      const { query, n = 12 } = args;

      console.log("🔍 Item lookup tool called with query:", query);

      try {
        const realDB = client.db("real_products_db");
        const realCollection = realDB.collection("products");

        // Quick connectivity check before vector search
        const docCount = await realCollection.countDocuments();
        if (docCount === 0) {
          console.warn("⚠️ No documents found in real_products_db.products");
          return JSON.stringify({
            results: [],
            error: "Database is empty or unreachable",
            count: 0,
            query,
          });
        }

        // Vector Store for real_products_db ONLY
        const vectorStoreRealDB = new MongoDBAtlasVectorSearch(
          new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            model: "text-embedding-004",
          }),
          {
            collection: realCollection,
            indexName: "real_products_vector_index",
            textKey: "embedding_text",
            embeddingKey: "embedding",
          }
        );

        // 1) VECTOR SEARCH
        const realResults = await vectorStoreRealDB.similaritySearchWithScore(query, n);

        if (realResults.length > 0) {
          console.log(`✅ Found ${realResults.length} products via vector search`);
          return JSON.stringify({
            results: realResults,
            searchType: "vector",
            source: "real_products_db",
            count: realResults.length,
            query,
          });
        }

        // 2) FALLBACK TEXT SEARCH
        console.log("⚠️ Vector search returned 0 results, trying text search...");

        const textReal = await realCollection
          .find({
            $or: [
              { name: { $regex: query, $options: "i" } },
              { keywords: { $regex: query, $options: "i" } },
              { embedding_text: { $regex: query, $options: "i" } },
            ],
          })
          .limit(n)
          .toArray();

        console.log(`Found ${textReal.length} products via text search`);

        return JSON.stringify({
          results: textReal,
          searchType: "text",
          source: "real_products_db",
          count: textReal.length,
          query,
        });

      } catch (error: any) {
        // Return graceful empty response instead of throwing
        // This prevents the LLM from retrying endlessly
        console.error("❌ Tool error:", error.message);
        return JSON.stringify({
          results: [],
          error: "Search is temporarily unavailable. Please try again later.",
          count: 0,
          query,
        });
      }
    }

    // Register Tool
    const itemLookupTool = tool<any, any>(itemLookupToolFunction, {
      name: "item_lookup",
      description:
        "Searches real_products_db.products for e-commerce products including apparel, shoes, accessories, kitchen items, sports equipment, and more. Call this ONCE per user message only.",
      schema: z.object({
        query: z.string(),
        n: z.number().optional().default(12),
      }),
    });

    const tools = [itemLookupTool];
    const toolNode = new ToolNode<any>(tools);

    const model = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      apiKey: process.env.GROQ_API_KEY,
    }).bindTools(tools);

    // -------------------- ROUTING with tool call limit --------------------
    function shouldContinue(state: any) {
      const messages = state.messages;
      const last = messages[messages.length - 1] as AIMessage;

      // Count how many times the agent has already called a tool
      const toolCallsMade = messages.filter(
        (m: BaseMessage) =>
          m instanceof AIMessage && (m as AIMessage).tool_calls?.length
      ).length;

      // Hard stop after 2 tool calls — prevents infinite loops
      if (toolCallsMade >= 2) {
        console.log("⛔ Tool call limit reached (2). Forcing end.");
        return "__end__";
      }

      if (last.tool_calls?.length) return "tools";
      return "__end__";
    }

    async function callModel(state: any) {
      return retryWithBackoff(async () => {
        const prompt = ChatPromptTemplate.fromMessages([
          [
            "system",
            `You are an AI Shopping Assistant for a multi-category e-commerce store.

STRICT RULES — FOLLOW EXACTLY:
- Call item_lookup ONLY ONCE per user message. No exceptions.
- After you receive tool results, IMMEDIATELY write your final answer to the user.
- NEVER call item_lookup again after you have already received results.
- Even if results are empty, just tell the user politely — do NOT retry with a different query.
- Do NOT rephrase and retry the same search.

You have access to the item_lookup tool which searches real_products_db.products database containing:
- Apparel (t-shirts, sweaters, socks)
- Shoes and footwear
- Accessories (hats, sunglasses, bags)
- Kitchen items (cookware, toasters, plates)
- Sports equipment (basketballs)
- Home items (towels, bath mats)

ALWAYS call item_lookup whenever the user asks about products.

When results are found:
- List products clearly with name, price, and rating
- Keep descriptions concise
- Highlight key features

If no results found:
- Apologize briefly
- Suggest similar categories
- Do NOT search again

FORMAT RULES:
If you ever show JSON in your answer, escape braces like this:
{{
  "action": "search",
  "query": "shoes"
}}

Current time: {time}`,
          ],
          new MessagesPlaceholder("messages"),
        ]);

        const formattedPrompt = await prompt.formatMessages({
          time: new Date().toISOString(),
          messages: state.messages,
        });

        const result = await model.invoke(formattedPrompt);
        return { messages: [result] };
      });
    }

    // Workflow graph
    const workflow = new StateGraph(GraphState)
      .addNode("agent", callModel)
      .addNode("tools", toolNode)
      .addEdge("__start__", "agent")
      .addConditionalEdges("agent", shouldContinue)
      .addEdge("tools", "agent");

    // Checkpointing
    const checkpointer = new MongoDBSaver({ client, dbName: "real_products_db" });

    const app = workflow.compile({ checkpointer });

    const finalState = await app.invoke(
      { messages: [new HumanMessage(query)] },
      {
        recursionLimit: 25, // raised as safety buffer
        configurable: { thread_id },
      }
    );

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    const responseContent =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : JSON.stringify(lastMessage.content);

    // ==================== EXTRACT PRODUCT IDs ====================
    const productIds: string[] = [];

    console.log("\n✅ Extracting product IDs from tool results...");

    for (const msg of finalState.messages) {
      if (msg instanceof AIMessage && msg.tool_calls && msg.tool_calls.length > 0) {
        for (const toolCall of msg.tool_calls) {
          if (toolCall.name === "item_lookup") {
            console.log(`🔧 Found item_lookup tool call: ${toolCall.id}`);

            const toolResultMsg = finalState.messages.find(
              (m: BaseMessage) =>
                m instanceof ToolMessage && m.tool_call_id === toolCall.id
            ) as ToolMessage | undefined;

            if (toolResultMsg && toolResultMsg.content) {
              try {
                const contentStr =
                  typeof toolResultMsg.content === "string"
                    ? toolResultMsg.content
                    : JSON.stringify(toolResultMsg.content);

                const result = JSON.parse(contentStr);

                if (result.results && Array.isArray(result.results)) {
                  console.log(`   Found ${result.results.length} results`);

                  result.results.forEach((item: any) => {
                    let productId = null;

                    if (Array.isArray(item)) {
                      const doc = item[0];
                      if (doc.metadata?.id) productId = doc.metadata.id;
                    } else {
                      if (item.id) productId = item.id;
                    }

                    if (productId) productIds.push(productId);
                  });
                }
              } catch (parseError) {
                console.error("Error parsing tool result:", parseError);
              }
            }
          }
        }
      }
    }

    const uniqueProductIds = [...new Set(productIds)].slice(0, 12);

    console.log(`✅ Extracted ${uniqueProductIds.length} unique product IDs`);
    console.log("Product IDs:", uniqueProductIds);

    return {
      response: responseContent,
      productIds: uniqueProductIds,
    };
  } catch (error: any) {
    console.error("Agent error:", error);

    if (error.status === 429) {
      throw new Error("Too many requests. Try again soon.");
    }

    throw new Error(`Agent failed: ${error.message}`);
  }
}
