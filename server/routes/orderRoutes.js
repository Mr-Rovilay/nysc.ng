import express from "express";
import { validateOrder } from "../middleware/validate.js";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../middleware/verifyJWT.js";
import {
  createOrder,
  deleteOrder,
  getUserOrders,
  updateOrder,
} from "../controllers/orderControllers.js";
const router = express.Router();

router.post("/order", verifyTokenAndAuthorization, validateOrder, createOrder);
router.put("/:id", verifyTokenAndAdmin, validateOrder, updateOrder);
router.delete("/:id", verifyTokenAndAdmin, deleteOrder);
router.get("/", verifyTokenAndAdmin, getUserOrders);

export default router;
