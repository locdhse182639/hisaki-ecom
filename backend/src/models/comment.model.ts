import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    content: { 
      type: String, 
      required: true,
      trim: true,
      minlength: [2, "Comment content must be at least 2 characters"],
      maxlength: [1000, "Comment content cannot exceed 1000 characters"]
    },
    rating: { 
      type: Number, 
      min: [1, "Rating must be at least 1"], 
      max: [5, "Rating cannot exceed 5"],
      required: true 
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    images: [{
      type: String
    }]
  },
  { timestamps: true }
);

// Create indexes for faster queries
CommentSchema.index({ product: 1 });
CommentSchema.index({ user: 1 });
CommentSchema.index({ createdAt: -1 });

export default mongoose.model("Comment", CommentSchema); 