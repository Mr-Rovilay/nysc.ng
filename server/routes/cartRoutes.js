import express from "express";
import {
  createCart,
  decreaseCartItemQuantity,
  deleteCart,
  getMyCart,
  increaseCartItemQuantity,
  removeFromCart,
} from "../controllers/cartControllers.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { validateCart } from "../middleware/validate.js";
const router = express();

router.post("/", verifyJWT, validateCart, createCart);
router.delete("/:productId", verifyJWT, removeFromCart);
router.post(
  "/decrease/:productId",
  verifyJWT,
  validateCart,
  decreaseCartItemQuantity
);
router.patch(
  "/increase/:productId",
  validateCart,
  verifyJWT,
  increaseCartItemQuantity
);
router.delete("/", verifyJWT, deleteCart);
router.get("/", verifyJWT, getMyCart);

export default router;
