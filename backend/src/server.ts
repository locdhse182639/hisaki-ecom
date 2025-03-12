import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./db";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import authRoutes from "./routes/auth.routes"
import categoryRoutes from "./routes/category.routes";
import commentRoutes from "./routes/comment.routes";
import userManagerRoutes from "./routes/userManager.routes";
import feedbackRoutes from "./routes/feedback.routes";
import { swaggerUi, specs } from "./swagger";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Routes
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user-manager", userManagerRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
const startServer = async () => {
  try {
    // Check if MongoDB URI is available
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error("Error: MONGODB_URI environment variable is not set.");
      console.error("Please create a .env file in the backend directory with MONGODB_URI=your_mongodb_connection_string");
      process.exit(1);
    }
    
    // Connect to MongoDB
    await connectToDatabase(mongoURI);
    console.log("Connected to MongoDB successfully");
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
