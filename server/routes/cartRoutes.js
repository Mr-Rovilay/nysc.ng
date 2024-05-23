import express from "express";
import {
  createCart,
  deleteCart,
  getUserCart,
  removeFromCart,
  updateCart,
} from "../controllers/cartControllers.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { validateCart } from "../middleware/validate.js";
const router = express();

router.post("/add", verifyJWT, validateCart, createCart);
router.delete("/remove", verifyJWT, validateCart, removeFromCart);
router.put("/:userId", verifyJWT, validateCart, updateCart);
router.delete("/", verifyJWT, deleteCart);
router.get("/", verifyJWT, getUserCart);

export default router;
