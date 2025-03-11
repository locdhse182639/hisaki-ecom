import express from "express";
import Comment from "../models/comment.model";
import { 
  CommentInputSchema, 
  CommentUpdateSchema, 
  CommentIdSchema,
  CommentQuerySchema,
  CommentLikeSchema
} from "../validators/comment.validator";
import { z } from "zod";
import { authenticateUser, authorizeRoles, AuthRequest } from "../middleware/auth.middleware";
import { connectToDatabase } from "../db";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    
    // Parse and validate query parameters
    const queryParams = CommentQuerySchema.parse(req.query);
    
    // Build filter object
    const filter: any = {};
    if (queryParams.product) {
      filter.product = queryParams.product;
    }
    if (queryParams.user) {
      filter.user = queryParams.user;
    }
    if (queryParams.isApproved !== undefined) {
      filter.isApproved = queryParams.isApproved;
    }
    if (queryParams.parentComment) {
      filter.parentComment = queryParams.parentComment;
    }
    if (queryParams.hasParent !== undefined) {
      if (queryParams.hasParent) {
        filter.parentComment = { $ne: null };
      } else {
        filter.parentComment = null;
      }
    }
    if (queryParams.minRating) {
      filter.rating = { $gte: queryParams.minRating };
    }
    
    // Pagination
    const page = queryParams.page || 1;
    const limit = queryParams.limit || 10;
    const skip = (page - 1) * limit;
    
    // Sorting
    let sort: any = { createdAt: -1 }; // Default: newest first
    if (queryParams.sortBy) {
      switch (queryParams.sortBy) {
        case "oldest":
          sort = { createdAt: 1 };
          break;
        case "highest_rating":
          sort = { rating: -1, createdAt: -1 };
          break;
        case "lowest_rating":
          sort = { rating: 1, createdAt: -1 };
          break;
        case "most_liked":
          sort = { "likes.length": -1, createdAt: -1 };
          break;
      }
    }
    
    // Execute query
    const comments = await Comment.find(filter)
      .populate("user", "name image")
      .populate("parentComment", "content")
      .skip(skip)
      .limit(limit)
      .sort(sort);
    
    // Get total count for pagination
    const total = await Comment.countDocuments(filter);
    
    // For each comment, get the reply count
    const commentsWithReplyCount = await Promise.all(
      comments.map(async (comment) => {
        const replyCount = await Comment.countDocuments({ 
          parentComment: comment._id 
        });
        
        return {
          ...comment.toObject(),
          replyCount,
          likesCount: comment.likes.length
        };
      })
    );
    
    res.status(200).json({
      comments: commentsWithReplyCount,
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
    console.error("Get Comments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await connectToDatabase();
    
    const { id } = CommentIdSchema.parse({ id: req.params.id });
    
    const comment = await Comment.findById(id)
      .populate("user", "name image")
      .populate("parentComment");
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Get reply count
    const replyCount = await Comment.countDocuments({ 
      parentComment: comment._id 
    });
    
    res.status(200).json({
      ...comment.toObject(),
      replyCount,
      likesCount: comment.likes.length
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    console.error("Get Comment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/",
  authenticateUser,
  async (req: AuthRequest, res) => {
    try {
      await connectToDatabase();
      
      // Validate request body
      const validatedData = CommentInputSchema.parse(req.body);
      
      // Create new comment
      const newComment = new Comment({
        ...validatedData,
        user: req.user?.userId,
      });
      
      // If it's a reply, verify parent comment exists
      if (validatedData.parentComment) {
        const parentComment = await Comment.findById(validatedData.parentComment);
        if (!parentComment) {
          return res.status(404).json({ 
            message: "Parent comment not found" 
          });
        }
        
        // Ensure parent comment is for the same product
        if (parentComment.product.toString() !== validatedData.product) {
          return res.status(400).json({ 
            message: "Parent comment must be for the same product" 
          });
        }
      }
      
      await newComment.save();
      
      // Populate user data
      await newComment.populate("user", "name image");
      
      res.status(201).json({
        message: "Comment created successfully",
        comment: newComment
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Create Comment Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   PUT /api/comments/:id
 * @desc    Update a comment
 * @access  Private (Owner or Admin)
 */
router.put(
  "/:id",
  authenticateUser,
  async (req: AuthRequest, res) => {
    try {
      await connectToDatabase();
      
      const { id } = CommentIdSchema.parse({ id: req.params.id });
      const validatedData = CommentUpdateSchema.parse(req.body);
      
      // Check if comment exists
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      // Check if user is the owner or has admin privileges
      const isOwner = comment.user.toString() === req.user?.userId;
      const isAdmin = req.user?.role === "Manager" || req.user?.role === "Staff";
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
          message: "You don't have permission to update this comment" 
        });
      }
      
      // Regular users can only update content and rating
      if (!isAdmin) {
        const { content, rating, images } = validatedData;
        const updateData = { content, rating, images };
        
        // Filter out undefined values
        Object.keys(updateData).forEach(key => {
          if (updateData[key as keyof typeof updateData] === undefined) {
            delete updateData[key as keyof typeof updateData];
          }
        });
        
        // Update comment
        const updatedComment = await Comment.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        ).populate("user", "name image");
        
        return res.status(200).json({
          message: "Comment updated successfully",
          comment: updatedComment
        });
      }
      
      // Admin update (can update all fields)
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { $set: validatedData },
        { new: true }
      ).populate("user", "name image");
      
      res.status(200).json({
        message: "Comment updated successfully",
        comment: updatedComment
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Update Comment Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (Owner or Admin)
 */
router.delete(
  "/:id",
  authenticateUser,
  async (req: AuthRequest, res) => {
    try {
      await connectToDatabase();
      
      const { id } = CommentIdSchema.parse({ id: req.params.id });
      
      // Check if comment exists
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      // Check if user is the owner or has admin privileges
      const isOwner = comment.user.toString() === req.user?.userId;
      const isAdmin = req.user?.role === "Manager" || req.user?.role === "Staff";
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
          message: "You don't have permission to delete this comment" 
        });
      }
      
      // Check if comment has replies
      const hasReplies = await Comment.exists({ parentComment: id });
      
      if (hasReplies && !isAdmin) {
        return res.status(400).json({ 
          message: "Cannot delete comment with replies. Only admins can delete comments with replies." 
        });
      }
      
      // If admin is deleting a comment with replies, update all replies to point to the parent of the deleted comment
      if (hasReplies && isAdmin) {
        await Comment.updateMany(
          { parentComment: id },
          { parentComment: comment.parentComment }
        );
      }
      
      // Delete comment
      await Comment.findByIdAndDelete(id);
      
      res.status(200).json({
        message: "Comment deleted successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Delete Comment Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   POST /api/comments/like
 * @desc    Like or unlike a comment
 * @access  Private
 */
router.post(
  "/like",
  authenticateUser,
  async (req: AuthRequest, res) => {
    try {
      await connectToDatabase();
      
      const { commentId } = CommentLikeSchema.parse(req.body);
      
      // Check if comment exists
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      const userId = new mongoose.Types.ObjectId(req.user?.userId);
      
      // Check if user already liked the comment
      const alreadyLiked = comment.likes.some(
        (id) => id.toString() === userId.toString()
      );
      
      if (alreadyLiked) {
        // Unlike the comment
        await Comment.findByIdAndUpdate(
          commentId,
          { $pull: { likes: userId } }
        );
        
        return res.status(200).json({
          message: "Comment unliked successfully"
        });
      }
      
      // Like the comment
      await Comment.findByIdAndUpdate(
        commentId,
        { $addToSet: { likes: userId } }
      );
      
      res.status(200).json({
        message: "Comment liked successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Like Comment Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @route   GET /api/comments/product/:productId
 * @desc    Get all comments for a specific product
 * @access  Public
 */
router.get("/product/:productId", async (req, res) => {
  try {
    await connectToDatabase();
    
    const productId = req.params.productId;
    
    // Get pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Get only top-level comments (no parent)
    const comments = await Comment.find({ 
      product: productId,
      parentComment: null,
      isApproved: true
    })
      .populate("user", "name image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Comment.countDocuments({ 
      product: productId,
      parentComment: null,
      isApproved: true
    });
    
    // For each comment, get the reply count and likes count
    const commentsWithCounts = await Promise.all(
      comments.map(async (comment) => {
        const replyCount = await Comment.countDocuments({ 
          parentComment: comment._id,
          isApproved: true
        });
        
        return {
          ...comment.toObject(),
          replyCount,
          likesCount: comment.likes.length
        };
      })
    );
    
    // Get product rating statistics
    const stats = await Comment.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
      { $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
          fiveStars: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          fourStars: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          threeStars: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          twoStars: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          oneStar: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } }
        }}
    ]);
    
    const ratingStats = stats.length > 0 ? {
      avgRating: parseFloat(stats[0].avgRating.toFixed(1)),
      totalRatings: stats[0].totalRatings,
      distribution: {
        5: stats[0].fiveStars,
        4: stats[0].fourStars,
        3: stats[0].threeStars,
        2: stats[0].twoStars,
        1: stats[0].oneStar
      }
    } : {
      avgRating: 0,
      totalRatings: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
    
    res.status(200).json({
      comments: commentsWithCounts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      ratingStats
    });
  } catch (error) {
    console.error("Get Product Comments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/comments/replies/:commentId
 * @desc    Get replies for a specific comment
 * @access  Public
 */
router.get("/replies/:commentId", async (req, res) => {
  try {
    await connectToDatabase();
    
    const commentId = req.params.commentId;
    
    // Get pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Get replies
    const replies = await Comment.find({ 
      parentComment: commentId,
      isApproved: true
    })
      .populate("user", "name image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Comment.countDocuments({ 
      parentComment: commentId,
      isApproved: true
    });
    
    // Add likes count to each reply
    const repliesWithLikes = replies.map(reply => ({
      ...reply.toObject(),
      likesCount: reply.likes.length
    }));
    
    res.status(200).json({
      replies: repliesWithLikes,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error("Get Comment Replies Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 