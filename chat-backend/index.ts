import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { callAgent } from "./agent";

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_ATLAS_URI!);

async function start() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(" MongoDB Atlas connected!");

    const db = client.db("inventory_database");
    const itemsCount = await db.collection("items").countDocuments();
    console.log(`📦 Found ${itemsCount} items in database`);
  } catch (error: any) {
    console.error(" MongoDB connection FAILED!");
    console.error("Error:", error.message);
    console.log("\nFix this first:");
    console.log("1. Go to MongoDB Atlas → Network Access");
    console.log("2. Click 'Add IP Address' → Allow 0.0.0.0/0");
    console.log("3. Wait 2 minutes and try again");
    process.exit(1);
  }

  app.get("/", (req, res) => res.send("Server OK"));
  app.get("/health", (req, res) => res.json({ status: "ok" }));

  // UPDATED: Chat endpoint - returns productIds
  app.post("/chat", async (req, res) => {
    try {
      const threadId = Date.now().toString();
      console.log(`\n New chat: "${req.body.message}"`);
      
      const result = await callAgent(client, req.body.message, threadId);
      
      console.log(`Response generated`);
      console.log(`Product IDs: ${result.productIds?.length || 0}`);
      
      res.json({ 
        threadId, 
        response: result.response,
        productIds: result.productIds || []
      });
    } catch (error: any) {
      console.error(" Chat error:", error);
      res.status(500).json({
        error: "Failed",
        response: "Sorry, error occurred.",
        productIds: []
      });
    }
  });

  // UPDATED: Continue chat endpoint - returns productIds
  app.post("/chat/:threadId", async (req, res) => {
    try {
      console.log(`\n Continue chat [${req.params.threadId}]: "${req.body.message}"`);
      
      const result = await callAgent(client, req.body.message, req.params.threadId);
      
      console.log(` Response generated`);
      console.log(`Product IDs: ${result.productIds?.length || 0}`);
      
      res.json({ 
        threadId: req.params.threadId, 
        response: result.response,
        productIds: result.productIds || []
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({
        error: "Failed",
        response: "Sorry, error occurred.",
        productIds: []
      });
    }
  });

  // NEW: Fetch products by IDs endpoint
  app.post("/products/by-ids", async (req, res) => {
    const { ids } = req.body;

    console.log("\n🔍 Fetching products by IDs:", ids);

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      console.log(" Invalid IDs");
      return res.status(400).json({
        error: "Invalid product IDs",
        products: [],
      });
    }

    try {
      // Search in both databases
      const realDb = client.db("real_products_db");
      const invDb = client.db("inventory_database");

      const [realProducts, invProducts] = await Promise.all([
        realDb
          .collection("products")
          .find({ id: { $in: ids } })
          .project({ embedding: 0, embedding_text: 0 })
          .toArray(),
        invDb
          .collection("items")
          .find({ item_id: { $in: ids } })
          .project({ embedding: 0, embedding_text: 0 })
          .toArray(),
      ]);

      console.log(`   Found ${realProducts.length} from real_products_db`);
      console.log(`   Found ${invProducts.length} from inventory_database`);

      // Combine and format products
      const allProducts = [
        ...realProducts.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.image,
          priceCents: p.priceCents,
          rating: p.rating,
          keywords: p.keywords,
        })),
        ...invProducts.map((p) => ({
          id: p.item_id,
          name: p.item_name,
          image: p.item_image,
          priceCents: Math.round(p.item_price * 100),
          rating: p.item_rating ? { stars: p.item_rating, count: 0 } : null,
          keywords: p.categories || [],
        })),
      ];

      // Sort products to match the order of requested IDs
      const sortedProducts = ids
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p) => p !== undefined);

      console.log(` Returning ${sortedProducts.length} products\n`);

      res.json({
        products: sortedProducts,
        count: sortedProducts.length,
      });
    } catch (error: any) {
      console.error(" Error fetching products:", error);
      res.status(500).json({
        error: "Internal server error",
        products: [],
      });
    }
  });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`\n Server running on http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`   POST /chat`);
    console.log(`   POST /chat/:threadId`);
    console.log(`   POST /products/by-ids`);
    console.log(``);
  });
}

start();