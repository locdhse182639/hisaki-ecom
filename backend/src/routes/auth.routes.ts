import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { Response } from "express";
import {
  UserSignUpSchema,
  UserSignInSchema,
} from "../validators/user.validator";
import { connectToDatabase } from "../db";
import { z } from "zod";
import { authenticateUser, AuthRequest } from "../middleware/auth.middleware";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post("/register", async (req, res) => {
  try {
    // Validate request body
    const validatedData = UserSignUpSchema.parse(req.body);

    console.log('validateData:', validatedData)

    // Check if email is already registered
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create a new user
    const newUser = new User({
      ...validatedData,
      password: hashedPassword,
      emailVerified: false,
      verificationToken,
    });
    await newUser.save();

    await sendVerificationEmail(newUser.email, verificationToken);

    // Generate JWT token
    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 */
router.post("/login", async (req, res) => {
  try {
    // Validate request body
    const validatedData = UserSignInSchema.parse(req.body);

    // Check if user exists
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(
      validatedData.password,
      user.password || ""
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile (Protected)
 */
router.get(
  "/profile",
  authenticateUser,
  async (req: AuthRequest, res: Response) => {
    try {
      await connectToDatabase();
      const user = await User.findById(req.user?.userId).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      console.error("Profile Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.emailVerified = true;
    // user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
