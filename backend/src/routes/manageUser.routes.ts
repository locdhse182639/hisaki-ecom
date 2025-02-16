import express from "express";
import {
    getUserbyId,
    getAlluser,
    updateUser,
    deleteUser,
    suspendUser,
}from "../controllers/manageUser.controller";

import {isManage}from "../middleware/auth.middleware";

const router = express.Router();

router.get("/users/:id", isManage, getUserbyId);
router.put("/users/:id", isManage, updateUser);
router.delete("/users/:id", isManage, deleteUser);
router.get("/users", isManage, getAlluser);
router.patch("/users/:id/suspend", isManage, suspendUser);

export default router;