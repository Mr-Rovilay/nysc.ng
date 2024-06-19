import express from "express";
import authControllers from "../controllers/authControllers.js";
import { validateUser } from "../middleware/validate.js";
const router = express();

router.post("/signup", validateUser, authControllers.signUp);
router.post("/signin", validateUser, authControllers.signIn);
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/reset-password/:id/:token", authControllers.resetPassword);

export default router;
