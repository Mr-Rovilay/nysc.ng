import express from "express";
import {
  createCart,
  deleteCart,
  getAllCart,
  getUserCart,
  updateCart,
} from "../controllers/cartControllers.js";
import {
  verifyJWT,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../middleware/verifyJWT.js";
import { validateCart } from "../middleware/validate.js";
const router = express();

router.post("/", verifyJWT, validateCart, createCart);
router.put("/:id", verifyTokenAndAuthorization, validateCart, updateCart);
router.delete("/:id", verifyTokenAndAuthorization, deleteCart);
router.get("/:userId", verifyTokenAndAuthorization, getUserCart);
router.get("/", verifyTokenAndAdmin, getAllCart);

export default router;
