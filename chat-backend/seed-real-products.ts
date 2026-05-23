/**
 * seed-real-products.ts
 *
 * - Reads products.json (array of product objects)
 * - Seeds real_products_db.products collection with embeddings
 * - Seeds carts, orders, delivery_options collections with embeddings (light summaries)
 * - Attempts to create vector index; if API unsupported, it will instruct manual creation
 *
 * Usage:
 *  1) Create products.json (see instructions)
 *  2) Set env vars: MONGODB_ATLAS_URI, GOOGLE_API_KEY
 *  3) Run: npx tsx seed-real-products.ts
 */

import { MongoClient } from "mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import "dotenv/config";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_ATLAS_URI!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

if (!MONGODB_URI) {
  console.error("Error: set MONGODB_ATLAS_URI in .env");
  process.exit(1);
}
if (!GOOGLE_API_KEY) {
  console.error("Error: set GOOGLE_API_KEY in .env");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

function createProductSummary(product: any) {
  const price = (product.priceCents ?? 0) / 100;
  const rating = product.rating?.stars ?? "N/A";
  const keywords = (product.keywords ?? []).join(", ");
  return `${product.name}. Price: $${price.toFixed(2)}. Rating: ${rating}. Keywords: ${keywords}.`;
}

function createCartSummary(cart: any[]) {
  return `Shopping cart contains ${cart.length} items: ${cart
    .map((it: any) => `${it.productName} (qty: ${it.quantity})`)
    .join(", ")}`;
}

function createDeliverySummary(option: any) {
  return `${option.name} - ${option.deliveryDays} days - $${(option.priceCents/100).toFixed(2)}`;
}

function createOrderSummary(order: any) {
  const date = new Date(order.orderTimeMs).toLocaleString();
  return `Order ${order.id} on ${date} — total $${(order.totalCostCents/100).toFixed(2)} — items: ${order.products.map((p:any)=>p.productName).join(", ")}`;
}

async function tryCreateSearchIndex(collection: any, indexName = "real_products_vector_index") {
  try {
    // createSearchIndex is available on the Node driver against Atlas Search Index API; may require specific driver version
    // if this fails, user can create index manually in Atlas UI as described later.
    const vectorSearchIdx = {
      name: indexName,
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: 768,
            similarity: "cosine",
          },
        ],
      },
    };
    // @ts-ignore - createSearchIndex may not be typed; try it and fall back gracefully
    await collection.createSearchIndex(vectorSearchIdx);
    console.log(`✅ Created search index: ${indexName}`);
  } catch (e: any) {
    console.warn("⚠️ Could not create vector index programmatically:", e?.message ?? e);
    console.log("→ Please create the vector index manually in MongoDB Atlas:")
    console.log(`   - DB: real_products_db`)
    console.log(`   - Collection: products`)
    console.log(`   - Index name: real_products_vector_index (type: vectorSearch)`)
    console.log(`   - Field: embedding (vector), numDimensions: 768, similarity: cosine`);
  }
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const realDb = client.db("real_products_db");

    // Create collections (if missing)
    const productsCollection = realDb.collection("products");
    const cartsCollection = realDb.collection("carts");
    const ordersCollection = realDb.collection("orders");
    const deliveryCollection = realDb.collection("delivery_options");

    // Read products.json
    const productsPath = path.join(process.cwd(), "products.json");
    if (!fs.existsSync(productsPath)) {
      console.error("products.json not found. Create it with your 44 products and retry.");
      process.exit(1);
    }
    const raw = fs.readFileSync(productsPath, "utf8");
    const products = JSON.parse(raw) as any[];

    console.log(`Loaded ${products.length} products from products.json`);

    // Clear old data (optional — you can comment these out if you want append-only)
    await productsCollection.deleteMany({});
    await cartsCollection.deleteMany({});
    await ordersCollection.deleteMany({});
    await deliveryCollection.deleteMany({});
    console.log("Cleared existing documents from collections (products, carts, orders, delivery_options)");

    // Try to create vector search index (best-effort)
    await tryCreateSearchIndex(productsCollection, "real_products_vector_index");

    // Create embeddings helper instance
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: GOOGLE_API_KEY,
      model: "text-embedding-004",
    });

    // Insert products (with embeddings) using LangChain helper
    console.log("\nSeeding products with embeddings...");
    for (const p of products) {
      const summary = createProductSummary(p);
      await MongoDBAtlasVectorSearch.fromDocuments(
        [{ pageContent: summary, metadata: { ...p, type: "product" } }],
        embeddings,
        {
          collection: productsCollection,
          indexName: "real_products_vector_index",
          textKey: "embedding_text",
          embeddingKey: "embedding",
        }
      );
      console.log(`  ✓ Inserted & embedded: ${p.name}`);
    }

    // Seed a sample cart
    const sampleCart = [
      {
        productId: products[0]?.id ?? "unknown",
        productName: products[0]?.name ?? "Sample product",
        quantity: 1,
        deliveryOptionId: "1",
        priceCents: products[0]?.priceCents ?? 0,
      },
    ];
    const cartSummary = createCartSummary(sampleCart);
    await MongoDBAtlasVectorSearch.fromDocuments(
      [{ pageContent: cartSummary, metadata: { items: sampleCart, type: "cart" } }],
      embeddings,
      {
        collection: cartsCollection,
        indexName: "real_products_vector_index",
        textKey: "embedding_text",
        embeddingKey: "embedding",
      }
    );
    console.log("  ✓ Seeded cart data");

    // Seed delivery options
    const deliveryOptions = [
      { id: "1", deliveryDays: 7, priceCents: 0, name: "Standard Shipping" },
      { id: "2", deliveryDays: 3, priceCents: 499, name: "Express Shipping" },
      { id: "3", deliveryDays: 1, priceCents: 999, name: "Next Day Delivery" },
    ];
    for (const d of deliveryOptions) {
      const s = createDeliverySummary(d);
      await MongoDBAtlasVectorSearch.fromDocuments(
        [{ pageContent: s, metadata: { ...d, type: "delivery_option" } }],
        embeddings,
        {
          collection: deliveryCollection,
          indexName: "real_products_vector_index",
          textKey: "embedding_text",
          embeddingKey: "embedding",
        }
      );
      console.log(`  ✓ Seeded delivery option: ${d.name}`);
    }

    // Seed orders
    const orders = [
      {
        id: "seed-order-1",
        orderTimeMs: Date.now(),
        totalCostCents: sampleCart.reduce((a:any,b:any)=>a + (b.priceCents*b.quantity), 0),
        products: sampleCart,
      },
    ];
    for (const o of orders) {
      const s = createOrderSummary(o);
      await MongoDBAtlasVectorSearch.fromDocuments(
        [{ pageContent: s, metadata: { ...o, type: "order" } }],
        embeddings,
        {
          collection: ordersCollection,
          indexName: "real_products_vector_index",
          textKey: "embedding_text",
          embeddingKey: "embedding",
        }
      );
      console.log(`  ✓ Seeded order: ${o.id}`);
    }

    // Final verification: count docs
    const pCount = await productsCollection.countDocuments();
    const cCount = await cartsCollection.countDocuments();
    const dCount = await deliveryCollection.countDocuments();
    const oCount = await ordersCollection.countDocuments();
    console.log("\n✅ Seeding complete:");
    console.log(`   products: ${pCount}`);
    console.log(`   carts: ${cCount}`);
    console.log(`   delivery_options: ${dCount}`);
    console.log(`   orders: ${oCount}`);

    console.log("\n🧾 Sample product document (without embedding):");
    const sampleDoc = await productsCollection.findOne({}, { projection: { embedding: 0 } });
    console.log(sampleDoc);

    console.log("\n⚠️ IMPORTANT: If you want the chatbot agent to search this DB, update the agent to also query `real_products_db.products` and use the same vector index name `real_products_vector_index` (or update agent to check both index names).");

    console.log("\nDone.");
  } catch (err: any) {
    console.error("Seeding error:", err?.message ?? err);
  } finally {
    await client.close();
  }
}

seed().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
