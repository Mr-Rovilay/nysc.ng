import express from "express";
import { validateOrder } from "../middleware/validate.js";
import { verifyJWT, verifyTokenAndAdmin } from "../middleware/verifyJWT.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  updateOrder,
} from "../controllers/orderControllers.js";
const router = express.Router();

router.post("/", verifyJWT, validateOrder, createOrder);
router.put("/:id", verifyTokenAndAdmin, validateOrder, updateOrder);
router.delete("/:id", verifyTokenAndAdmin, deleteOrder);
router.get("/", verifyTokenAndAdmin, getAllOrders);
router.get("/", verifyJWT, getMyOrders);

export default router;
