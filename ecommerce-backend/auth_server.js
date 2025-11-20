import express from "express";
import userRoutes from "./routes/user.routes.js";
import { authenticationMiddleware } from "./middleware/auth.middleware.js";


// import db from "./db/index.js";
// import { usersTable, userSessions } from "./db/schema.js";
// import { eq } from "drizzle-orm";
// import jwt from "jsonwebtoken";
import adminRouter from "./routes/admin.routes.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.use(authenticationMiddleware);

app.get("/", (req, res) => {
  res.json({ status: "server is running" });
});
app.use("/users", userRoutes);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
