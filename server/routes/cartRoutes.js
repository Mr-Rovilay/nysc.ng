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

router.post("/:userId/add", verifyJWT, validateCart, createCart);
router.put("/:userId", verifyTokenAndAuthorization, validateCart, updateCart);
router.delete("/:id", deleteCart);
router.get("/:id", verifyTokenAndAuthorization, getUserCart);
router.get("/", verifyTokenAndAdmin, getAllCart);

export default router;
