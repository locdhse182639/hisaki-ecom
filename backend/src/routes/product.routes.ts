import express, { Request, Response } from "express";
import Product from "../models/product.model";

const router = express.Router();

// Fetch all categories
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await Product.find({ isPublished: true }).distinct(
      "category"
    );
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Fetch products by tag
router.get("/products", async (req, res) => {
  const { tag, limit = 4 } = req.query;
  try {
    const products = await Product.find(
      { tags: { $in: [tag] }, isPublished: true },
      { name: 1, slug: 1, images: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    const transformedProducts = products.map((product) => ({
      name: product.name,
      href: `/product/${product.slug}`,
      image: product.images[0],
    }));
    res.json(transformedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
