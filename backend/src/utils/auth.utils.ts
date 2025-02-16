import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
