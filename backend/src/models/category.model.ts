import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"]
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    description: { 
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    image: { 
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    }
  },
  { timestamps: true }
);

// Create index for faster queries
CategorySchema.index({ name: 1 });
CategorySchema.index({ slug: 1 });

export default mongoose.model("Category", CategorySchema); 