import "dotenv/config"; // ✅ THIS LINE MUST BE FIRST — loads .env
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { sequelize } from "./models/index.js";

// Routes
import productRoutes from "./routes/products.js";
import deliveryOptionRoutes from "./routes/deliveryOptions.js";
import cartItemRoutes from "./routes/cartItems.js";
import orderRoutes from "./routes/orders.js";
import resetRoutes from "./routes/reset.js";
import paymentSummaryRoutes from "./routes/paymentSummary.js";

// Models
import { Product } from "./models/Product.js";
import { DeliveryOption } from "./models/DeliveryOption.js";
import { CartItem } from "./models/CartItem.js";
import { Order } from "./models/Order.js";

// Default data
import { defaultProducts } from "./defaultData/defaultProducts.js";
import { defaultDeliveryOptions } from "./defaultData/defaultDeliveryOptions.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "images")));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/delivery-options", deliveryOptionRoutes);
app.use("/api/cart-items", cartItemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment-summary", paymentSummaryRoutes);
app.use("/api/reset", resetRoutes);

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

// ─── DB SYNC & SEED ───────────────────────────────────────────────────────────
(async () => {
  try {
    await sequelize.sync();

    // Seed products
    const productCount = await Product.count();
    if (productCount === 0) {
      console.log("Seeding products...");
      await Product.bulkCreate(defaultProducts);
      console.log(`✅ ${defaultProducts.length} products seeded.`);
    }

    // ✅ Seed delivery options separately so they always exist
    const deliveryCount = await DeliveryOption.count();
    if (deliveryCount === 0) {
      console.log("Seeding delivery options...");
      await DeliveryOption.bulkCreate(defaultDeliveryOptions);
      console.log(`✅ ${defaultDeliveryOptions.length} delivery options seeded.`);
    }

    app.listen(PORT, () => {
      console.log(`✅ ecommerce-backend running on port ${PORT}`);
      console.log(`✅ JWT_SECRET loaded: ${process.env.JWT_SECRET ? "YES" : "NO"}`);
    });
  } catch (err) {
    console.error("❌ Failed to sync database:", err);
  }
})();
