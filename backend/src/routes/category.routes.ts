import express from "express";
import Category from "../models/category.model";
import { 
  CategoryInputSchema, 
  CategoryUpdateSchema, 
  CategoryIdSchema,
  CategoryQuerySchema
} from "../validators/category.validator";
import { z } from "zod";
import { authenticateUser, authorizeRoles, AuthRequest } from "../middleware/auth.middleware";
import { connectToDatabase } from "../db";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories with optional filtering
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: parentCategory
 *         schema:
 *           type: string
 *         description: Parent category ID to filter by
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter by category name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    
    // Parse and validate query parameters
    const queryParams = CategoryQuerySchema.parse(req.query);
    
    // Build filter object
    const filter: any = {};
    if (queryParams.isActive !== undefined) {
      filter.isActive = queryParams.isActive;
    }
    if (queryParams.parentCategory) {
      filter.parentCategory = queryParams.parentCategory;
    }
    if (queryParams.search) {
      filter.name = { $regex: queryParams.search, $options: "i" };
    }
    
    // Pagination
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 10;
    const skip = (page - 1) * limit;
    
    // Execute query
    const categories = await Category.find(filter)
      .populate("parentCategory", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Category.countDocuments(filter);
    
    res.status(200).json({
      categories,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/categories/:id
 * @desc    Get a category by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    await connectToDatabase();
    
    const { id } = CategoryIdSchema.parse({ id: req.params.id });
    
    const category = await Category.findById(id).populate("parentCategory", "name");
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(200).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error("Get Category Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (Admin/Manager)
 */
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["Manager", "Staff"]),
  async (req: AuthRequest, res) => {
    try {
      await connectToDatabase();
      
      // Validate request body
      const validatedData = CategoryInputSchema.parse(req.body);
      
      // Check if category with same name or slug already exists
      const existingCategory = await Category.findOne({
        $or: [
          { name: validatedData.name },
          { slug: validatedData.slug }
        ]
      });
      
      if (existingCategory) {
        return res.status(400).json({ 
          message: "Category with this name or slug already exists" 
        });
      }
      
      // Create new category
      const newCategory = new Category(validatedData);
      await newCategory.save();
      
      res.status(201).json({
        message: "Category created successfully",
        category: newCategory
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Create Category Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private (Admin/Manager)
 */
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles(["Manager", "Staff"]),
  async (req: AuthRequest, res) => {
    try {
      await connectToDatabase();
      
      const { id } = CategoryIdSchema.parse({ id: req.params.id });
      const validatedData = CategoryUpdateSchema.parse(req.body);
      
      // Check if category exists
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // Check if name or slug is being updated and if it already exists
      if (validatedData.name || validatedData.slug) {
        const existingCategory = await Category.findOne({
          _id: { $ne: id },
          $or: [
            validatedData.name ? { name: validatedData.name } : {},
            validatedData.slug ? { slug: validatedData.slug } : {}
          ]
        });
        
        if (existingCategory) {
          return res.status(400).json({ 
            message: "Category with this name or slug already exists" 
          });
        }
      }
      
      // Update category
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { $set: validatedData },
        { new: true }
      );
      
      res.status(200).json({
        message: "Category updated successfully",
        category: updatedCategory
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Update Category Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private (Admin/Manager)
 */
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles(["Manager"]),
  async (req: AuthRequest, res) => {
    try {
      await connectToDatabase();
      
      const { id } = CategoryIdSchema.parse({ id: req.params.id });
      
      // Check if category exists
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // Check if category has child categories
      const childCategories = await Category.findOne({ parentCategory: id });
      if (childCategories) {
        return res.status(400).json({ 
          message: "Cannot delete category with child categories. Remove or reassign child categories first." 
        });
      }
      
      // Check if category is used in products (assuming you have a Product model)
      // This would require importing your Product model
      // const productsUsingCategory = await Product.findOne({ category: id });
      // if (productsUsingCategory) {
      //   return res.status(400).json({ 
      //     message: "Cannot delete category that is used in products. Remove or reassign products first." 
      //   });
      // }
      
      // Delete category
      await Category.findByIdAndDelete(id);
      
      res.status(200).json({
        message: "Category deleted successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Delete Category Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router; 