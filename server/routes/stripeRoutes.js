import express from "express";
import { createPayment } from "../controllers/srtipeControllers.js";

const router = express();

router.post("/checkout", createPayment);

export default router;
