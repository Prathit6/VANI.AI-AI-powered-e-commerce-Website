import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./models/index.js";

// Import routes
import productRoutes from "./routes/products.js";
import deliveryOptionRoutes from "./routes/deliveryOptions.js";
import cartItemRoutes from "./routes/cartItems.js";
import orderRoutes from "./routes/orders.js";
import resetRoutes from "./routes/reset.js";
import paymentSummaryRoutes from "./routes/paymentSummary.js";

// Import models
import { Product } from "./models/Product.js";
import { DeliveryOption } from "./models/DeliveryOption.js";
import { CartItem } from "./models/CartItem.js";
import { Order } from "./models/Order.js";

// Import default data
import { defaultProducts } from "./defaultData/defaultProducts.js";
import { defaultDeliveryOptions } from "./defaultData/defaultDeliveryOptions.js";
import { defaultCart } from "./defaultData/defaultCart.js";
import { defaultOrders } from "./defaultData/defaultOrders.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------- MIDDLEWARE ---------------------
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Serve images from /images
app.use("/images", express.static(path.join(__dirname, "images")));

// --------------------- ROUTES ---------------------
app.use("/api/products", productRoutes);
app.use("/api/delivery-options", deliveryOptionRoutes);
app.use("/api/cart-items", cartItemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reset", resetRoutes);
app.use("/api/payment-summary", paymentSummaryRoutes);

// --------------------- ERROR HANDLING ---------------------
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
/* eslint-enable no-unused-vars */

// --------------------- DATABASE SYNC & DEFAULT DATA ---------------------
(async () => {
  try {
    await sequelize.sync();

    const productCount = await Product.count();
    if (productCount === 0) {
      console.log("Seeding default data...");

      await Product.bulkCreate(defaultProducts);
      await DeliveryOption.bulkCreate(defaultDeliveryOptions);
      await CartItem.bulkCreate(defaultCart);
      await Order.bulkCreate(defaultOrders);

      console.log("Default data loaded successfully.");
    }

    // --------------------- START SERVER ---------------------
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to sync database:", err);
  }
})();
