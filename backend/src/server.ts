import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./db";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import authRoutes from "./routes/auth.routes"
import categoryRoutes from "./routes/category.routes";
import commentRoutes from "./routes/comment.routes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
const startServer = async () => {
  try {
    await connectToDatabase(process.env.MONGODB_URI || "");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
