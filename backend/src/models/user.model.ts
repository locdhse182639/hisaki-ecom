import { Document, Model, model, models, Schema } from "mongoose";
import { IUserInput } from "../types";

export interface IUser extends Document, IUserInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  suspended: boolean;
  suspensionEndDate?: Date;
  suspensionReason?: string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'User' },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: undefined },
    suspended: { type: Boolean, required: true, default: false },
    suspensionEndDate: { type: Date },
    suspensionReason: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema);

export default User;
