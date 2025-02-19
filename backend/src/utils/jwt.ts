import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // Ensure you have this in .env
const JWT_EXPIRES_IN = "7d"; // Token expiration time

interface JwtPayload {
  userId: string;
  role: string;
}

/**
 * Generate JWT Token
 * @param userId - The ID of the authenticated user
 * @param role - The role of the user
 * @returns Signed JWT token
 */
export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT Token
 * @param token - JWT token to verify
 * @returns Decoded token payload if valid, otherwise throws an error
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};