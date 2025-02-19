// import { model, Schema, Document } from "mongoose";
// import { IOrderItem } from "./orderitem.model";

// export interface ICart extends Document {
//   user: string;
//   items: IOrderItem[];
//   itemsPrice: number;
//   taxPrice?: number;
//   shippingPrice?: number;
//   totalPrice: number;
//   paymentMethod?: string;
//   deliveryDateIndex?: number;
//   expectedDeliveryDate?: Date;
// }

// const CartSchema = new Schema<ICart>(
//   {
//     user: { type: String, required: true }, // Store cart per user
//     items: [{ type: Schema.Types.ObjectId, ref: "OrderItem", required: true }],
//     itemsPrice: { type: Number, required: true },
//     taxPrice: { type: Number },
//     shippingPrice: { type: Number },
//     totalPrice: { type: Number, required: true },
//     paymentMethod: { type: String },
//     deliveryDateIndex: { type: Number },
//     expectedDeliveryDate: { type: Date },
//   },
//   { timestamps: true }
// );

// export default model<ICart>("Cart", CartSchema);

import mongoose from "mongoose";
import OrderItem from "./orderitem.model";

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  items: [OrderItem.schema], 
  totalPrice: { type: Number, required: true, default: 0 },
});

CartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((acc, item) => acc + item.subtotal, 0);
  next();
});

export default mongoose.model("Cart", CartSchema);
