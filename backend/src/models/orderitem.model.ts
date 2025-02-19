// import { model, Schema, Document } from "mongoose";

// export interface IOrderItem extends Document {
//   clientId: string;
//   product: Schema.Types.ObjectId;
//   name: string;
//   slug: string;
//   category: string;
//   quantity: number;
//   countInStock: number;
//   image: string;
//   price: number;
//   size?: string;
//   color?: string;
// }

// export const OrderItemSchema = new Schema<IOrderItem>(
//   {
//     clientId: { type: String, required: true },
//     product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
//     name: { type: String, required: true },
//     slug: { type: String, required: true },
//     category: { type: String, required: true },
//     quantity: { type: Number, required: true, min: 0 },
//     countInStock: { type: Number, required: true, min: 0 },
//     image: { type: String, required: true },
//     price: { type: Number, required: true },
//     size: { type: String },
//     color: { type: String },
//   },
//   { timestamps: true }
// );

// export default model<IOrderItem>("OrderItem", OrderItemSchema);
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
  name: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  countInStock: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  size: { type: String, default: "" },
  color: { type: String, default: "" },
  subtotal: { type: Number, required: true, default: 0 },
});


OrderItemSchema.pre("save", function (next) {
  this.subtotal = this.price * this.quantity; 
  next();
});

export default mongoose.model("OrderItem", OrderItemSchema);
