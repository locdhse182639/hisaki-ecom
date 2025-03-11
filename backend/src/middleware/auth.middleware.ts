import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

/**
 * Middleware to verify JWT token
 */
export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = verifyToken(token);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Middleware to authorize user roles
 * @param allowedRoles Array of roles allowed to access the route
 */
export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. You don't have permission to perform this action" 
      });
    }

    next();
  };
};
