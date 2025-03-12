import { z } from "zod";

export const FeedbackInputSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    productId: z.string().min(1, "Product ID is required"),
    rating: z.number()
        .min(0, "Rating must be at least 0")
        .max(5, "Rating must be at most 5")
        .multipleOf(0.5, "Rating must be a multiple of 0.5"), // Allows 0, 0.5, 1, 1.5, ..., 5
    comment: z.string()
        .min(3, "Comment must be at least 3 characters")
        .max(500, "Comment must not exceed 500 characters")
        .optional(),
    images: z.array(z.string().url("Invalid image URL")).optional(),
    purchaseVerified: z.boolean().default(false),
});

// For updating feedback
export const FeedbackUpdateSchema = FeedbackInputSchema.partial().omit({ 
    userId: true,
    productId: true,
    purchaseVerified: true 
});

export type IFeedbackInput = z.infer<typeof FeedbackInputSchema>;
export type IFeedbackUpdate = z.infer<typeof FeedbackUpdateSchema>; 