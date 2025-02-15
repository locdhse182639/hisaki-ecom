import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export const Roles = ["User", "Staff", "Manager"] as const;
export const PaymentMethods = ["VnPay", "Paypal"] as const;
export const SkinTypes = ["Normal skin", "Dry skin", "Oily skin", "Combination skin", "Sensitive skin"] as const;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  skinType: string;
  emailVerified: boolean;
  paymentMethod: string;
  address: {
    fullName?: string;
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema của User
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Roles, default: "User" },
    skinType: { type: String, enum: SkinTypes, required: true },
    emailVerified: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: PaymentMethods, default: "VnPay" },
    address: {
      fullName: { type: String, default: "" },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      province: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Hash password trước khi lưu user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh password khi đăng nhập
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);