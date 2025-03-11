import express from "express";
import { Response } from "express";
import { authenticateUser, AuthRequest } from "../middleware/auth.middleware";
import User from "../models/user.model";
import { z } from "zod";

const router = express.Router();

// Middleware to check if user is a Manager
const isManager = async (req: AuthRequest, res: Response, next: Function) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (user?.role !== "Manager") {
      return res.status(403).json({ message: "Access denied. Manager role required." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Validation schema for suspension
const SuspendAccountSchema = z.object({
  suspensionEndDate: z.string().datetime().optional(),
  reason: z.string().min(1, "Reason is required"),
});

/**
 * @swagger
 * /api/user-manager/suspend/{userId}:
 *   post:
 *     summary: Suspend a user account (Manager only)
 *     tags: [UserManager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               suspensionEndDate:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account suspended successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.post(
  "/suspend/:userId",
  authenticateUser,
  isManager,
  async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;
      const validatedData = SuspendAccountSchema.parse(req.body);

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user with suspension details
      user.suspended = true;
      user.suspensionEndDate = validatedData.suspensionEndDate ? new Date(validatedData.suspensionEndDate) : undefined;
      user.suspensionReason = validatedData.reason;
      await user.save();

      res.status(200).json({
        message: "Account suspended successfully",
        suspensionDetails: {
          endDate: user.suspensionEndDate,
          reason: validatedData.reason,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @swagger
 * /api/user-manager/delete/{userId}:
 *   delete:
 *     summary: Delete a user account (Manager only)
 *     tags: [UserManager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.delete(
  "/delete/:userId",
  authenticateUser,
  isManager,
  async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent deletion of other managers
      if (user.role === "Manager") {
        return res.status(403).json({ message: "Cannot delete another manager's account" });
      }

      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router; 