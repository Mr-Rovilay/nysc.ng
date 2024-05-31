import express from "express";
import {
  createCart,
  deleteCart,
  getMyCart,
  removeFromCart,
  updateCart,
} from "../controllers/cartControllers.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { validateCart } from "../middleware/validate.js";
const router = express();

router.post("/", verifyJWT, createCart);
router.delete("/:productId", verifyJWT, removeFromCart);
router.put("/", verifyJWT, updateCart);
router.delete("/", verifyJWT, deleteCart);
router.get("/", verifyJWT, getMyCart);

export default router;
