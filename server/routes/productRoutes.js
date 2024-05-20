import express from "express";
import {
  createPost,
  deletedProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/productController.js";
import { verifyTokenAndAdmin } from "../middleware/verifyJWT.js";
import { validateProduct } from "../middleware/validate.js";

const router = express.Router();

router.post("/", verifyTokenAndAdmin, validateProduct, createPost);
router.get("/:id", getProduct);
router.get("/", getAllProduct);
router.delete("/:id", verifyTokenAndAdmin, deletedProduct);
router.put("/:id", verifyTokenAndAdmin, validateProduct, updateProduct);
export default router;
