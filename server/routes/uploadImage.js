import express from "express";
import { uploadUrl } from "../controllers/uploadImageControllers.js";

const router = express();

router.get("/", uploadUrl);

export default router;
