import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./db";
import productRoutes from "./routes/product.routes";
import authRoutes from "./routes/auth.routes"; // Thêm authRoutes

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Cần có để đọc JSON từ request

// Routes
app.use("/api/products", productRoutes); // Chỉnh lại route cho sản phẩm
app.use("/api/auth", authRoutes); // Thêm route cho authentication

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
