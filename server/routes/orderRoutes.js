import express from "express";
import { validateOrder, validateOrderStatus } from "../middleware/validate.js";
import { verifyJWT, verifyTokenAndAdmin } from "../middleware/verifyJWT.js";
import {
  adminDeleteOrder,
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  updateOrder,
} from "../controllers/orderControllers.js";
const router = express.Router();

router.post("/", verifyJWT, validateOrder, createOrder);
router.put("/:orderId", verifyTokenAndAdmin, validateOrderStatus, updateOrder);
//users can delete there orders
router.delete("/:id", verifyJWT, deleteOrder);
//admin can delete order
router.delete("/admin/:id", verifyTokenAndAdmin, adminDeleteOrder);
//admin get all orders
router.get("/", verifyTokenAndAdmin, getAllOrders);
router.get("/myorders", verifyJWT, getMyOrders);
//cancel order by user
router.put("/:id/cancel", verifyJWT, cancelOrder);

export default router;
