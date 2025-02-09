import { Schema, model, Document } from "mongoose";

interface IRatingDistribution {
  rating: number;
  count: number;
}

interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  images: string[];
  brand: string;
  description: string;
  price: number;
  listPrice: number;
  countInStock: number;
  tags: string[];
  sizes: string[];
  colors: string[];
  avgRating: number;
  numReviews: number;
  numSales: number;
  isPublished: boolean;
  ratingDistribution: IRatingDistribution[];
  reviews: string[]; // Array of ObjectId references to a Review collection
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    listPrice: { type: Number, default: 0 },
    countInStock: { type: Number, required: true },
    tags: { type: [String], default: ["new arrival"] },
    sizes: { type: [String], default: ["S", "M", "L"] },
    colors: { type: [String], default: ["White", "Red", "Black"] },
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    numSales: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    ratingDistribution: [
      {
        rating: { type: Number, required: true },
        count: { type: Number, required: true },
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export default model<IProduct>("Product", productSchema);
