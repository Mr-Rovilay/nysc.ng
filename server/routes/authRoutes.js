import express from "express";
import authControllers from "../controllers/authControllers.js";
const router = express();

router.post("/signup", authControllers.signUp);
router.post("/signin", authControllers.signIn);

export default router;
