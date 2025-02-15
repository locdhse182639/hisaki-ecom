import express from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { validate } from "../validators/auth.validator";
import { RegisterSchema, LoginSchema } from "../validators/auth.validator";

const router = express.Router();

router.post("/register", validate(RegisterSchema), register);
router.post("/login", validate(LoginSchema), login);
router.post("/logout", logout);

export default router;