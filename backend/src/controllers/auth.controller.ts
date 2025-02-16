import { Request, Response } from "express";
import User, { userStatus } from "../models/user.model";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateToken } from "../utils/auth.utils";
dotenv.config();
//Register o day
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, userStatus, role, skinType, paymentMethod, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    const newUser = new User({ name, email, password, userStatus: userStatus || "Active", role, skinType, paymentMethod, address });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, userStatus: newUser.userStatus },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
//Login o day
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, userStatus: user.userStatus } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
//Logout o day
export const logout = async (_req: Request, res: Response) => {
  res.json({ message: "User logged out successfully" });
};
