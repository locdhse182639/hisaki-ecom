import { z } from "zod";

// Schema for creating a new comment
export const CommentInputSchema = z.object({
  product: z.string().min(1, { message: "Product ID is required" }),
  content: z
    .string()
    .min(2, { message: "Comment content must be at least 2 characters" })
    .max(1000, { message: "Comment content cannot exceed 1000 characters" }),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating cannot exceed 5" }),
  parentComment: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// Schema for updating an existing comment
export const CommentUpdateSchema = z.object({
  content: z
    .string()
    .min(2, { message: "Comment content must be at least 2 characters" })
    .max(1000, { message: "Comment content cannot exceed 1000 characters" })
    .optional(),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating cannot exceed 5" })
    .optional(),
  isApproved: z.boolean().optional(),
  images: z.array(z.string()).optional(),
});

// Schema for comment ID validation
export const CommentIdSchema = z.object({
  id: z.string().min(1, { message: "Comment ID is required" }),
});

// Schema for liking/unliking a comment
export const CommentLikeSchema = z.object({
  commentId: z.string().min(1, { message: "Comment ID is required" }),
});

// Schema for querying comments
export const CommentQuerySchema = z.object({
  product: z.string().optional(),
  user: z.string().optional(),
  isApproved: z.boolean().optional(),
  parentComment: z.string().optional(),
  hasParent: z.boolean().optional(),
  minRating: z.number().min(1).max(5).optional(),
  limit: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
  sortBy: z.enum(["newest", "oldest", "highest_rating", "lowest_rating", "most_liked"]).optional(),
}); 