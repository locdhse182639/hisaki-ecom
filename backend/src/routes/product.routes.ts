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

// Fetch products for card
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
    res.status(500).json({ error: "Failed to fetch products for card" });
  }
});

//fetch product by tag
router.get("/products-by-tag", async (req, res) => {
  const { tag, limit = 10 } = req.query;
  try {
    const products = await Product.find(
      { tags: { $in: [tag] }, isPublished: true },
      { name: 1, slug: 1, images: 1, price: 1, avgRating: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products by tag" });
  }
});

//Get one product by slug
router.get("/product/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isPublished: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Get related products by category
router.get("/products/related", async (req: Request, res: Response) => {
  try {
    const { category, productId, limit = 9, page = 1 } = req.query;
    const skipAmount = (Number(page) - 1) * Number(limit);

    const conditions = {
      isPublished: true,
      category,
      _id: { $ne: productId },
    };

    const products = await Product.find(conditions)
      .sort({ numSales: -1 })
      .skip(skipAmount)
      .limit(Number(limit));

    const productsCount = await Product.countDocuments(conditions);

    res.json({
      data: products,
      totalPages: Math.ceil(productsCount / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch related products" });
  }
});

export default router;
