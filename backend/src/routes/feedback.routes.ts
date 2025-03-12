import express from "express";
import { Response } from "express";
import { authenticateUser, AuthRequest } from "../middleware/auth.middleware";
import Feedback from "../models/feedback.model";
import { FeedbackInputSchema, FeedbackUpdateSchema } from "../validators/feedback.validator";
import { z } from "zod";

const router = express.Router();

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Feedback created successfully
 */
router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
    try {
        const validatedData = FeedbackInputSchema.parse({
            ...req.body,
            userId: req.user?.userId
        });

        // Check if user has already given feedback for this product
        const existingFeedback = await Feedback.findOne({
            userId: validatedData.userId,
            productId: validatedData.productId
        });

        if (existingFeedback) {
            return res.status(400).json({ message: "You have already provided feedback for this product" });
        }

        // Create new feedback
        const feedback = new Feedback(validatedData);
        await feedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @swagger
 * /api/feedback/product/{productId}:
 *   get:
 *     summary: Get all feedback for a product
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of feedback for the product
 */
router.get("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const feedback = await Feedback.find({ productId })
            .populate('userId', 'name image')
            .sort({ createdAt: -1 });

        // Calculate average rating
        const ratings = feedback.map(f => f.rating);
        const averageRating = ratings.length > 0 
            ? ratings.reduce((a, b) => a + b) / ratings.length 
            : 0;

        res.json({
            feedback,
            stats: {
                totalReviews: feedback.length,
                averageRating: Math.round(averageRating * 2) / 2, // Round to nearest 0.5
                verifiedPurchases: feedback.filter(f => f.purchaseVerified).length
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @swagger
 * /api/feedback/{feedbackId}:
 *   put:
 *     summary: Update a feedback (owner only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 */
router.put("/:feedbackId", authenticateUser, async (req: AuthRequest, res: Response) => {
    try {
        const { feedbackId } = req.params;
        const validatedData = FeedbackUpdateSchema.parse(req.body);

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        // Check if user owns the feedback
        if (feedback.userId.toString() !== req.user?.userId) {
            return res.status(403).json({ message: "Not authorized to update this feedback" });
        }

        // Update feedback
        Object.assign(feedback, validatedData);
        await feedback.save();

        res.json({
            message: "Feedback updated successfully",
            feedback
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors });
        }
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @swagger
 * /api/feedback/{feedbackId}:
 *   delete:
 *     summary: Delete a feedback (owner or manager only)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: string
 */
router.delete("/:feedbackId", authenticateUser, async (req: AuthRequest, res: Response) => {
    try {
        const { feedbackId } = req.params;
        
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        // Check if user owns the feedback or is a manager
        const user = await req.user;
        if (feedback.userId.toString() !== user?.userId && user?.role !== "Manager") {
            return res.status(403).json({ message: "Not authorized to delete this feedback" });
        }

        await feedback.deleteOne();

        res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router; 