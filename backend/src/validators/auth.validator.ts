import { z } from "zod";
import { Roles, SkinTypes, PaymentMethods, userStatus } from "../models/user.model";

// Schema Register
export const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters").max(15, "Password cannot exceed 15 characters"),
    userStatus: z.enum(userStatus).default("Active"),
    role: z.enum(Roles).default("User"),
    skinType: z.enum(SkinTypes, { message: "Invalid skin type" }),
    paymentMethod: z.enum(PaymentMethods).default("VnPay"),
    address: z.object({
        fullName: z.string().optional(),
        street: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        phone: z.string().optional(),
    }).optional(),
});

// Schema Login
export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").max(15, "Password cannot exceed 15 characters"),
});

// Middleware kiểm tra dữ liệu đầu vào
export const validate =
  (schema: any) => (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
