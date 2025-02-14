import mongoose, {Schema, Document} from "mongoose";
import bycrypt from "bcrypt";
export interface IUser extends Document 
{
 name: string;
 email: string;
 password: string;
 skinType: string;
 role: string;
 emailVerified: boolean;
 paymentMethod: string;
 address:{
  fullName: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
 };
 ComparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    skinType: {type: String, required: true},
    role: {type: String, enum: ["User","Admin","Manager"]},
    emailVerified: {type: Boolean, default: false},
    paymentMethod: {type: String, enum: ["VnPay", "Paypal"], required: true},
    address: {
      fullName: String,
      street: String,
      city: String,
      province: String,
      postalCode: String,
      country: String,
      phone: String,
    },
  },
  {timestamps: true}
);
//Hash password
userSchema.pre("save", async function (next)
{
  if (this.isModified("password")) return next();
  const salt = await bycrypt.genSalt(10);
  this.password = await bycrypt.hash(this.password, salt);
  next();
}
);
userSchema.methods.ComparePassword = async function (inputPassword: string){
  return bycrypt.compare(inputPassword, this.password);
};
export default mongoose.model<IUser>("Users", userSchema);
