import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userControllers.js";
import { verifyJWT, verifyTokenAndAdmin } from "../middleware/verifyJWT.js";

const router = express.Router();

router.put("/:id", verifyJWT, updateUser);
router.delete("/:id", verifyJWT, deleteUser);
router.get("/:id", verifyJWT, getUser);
router.get("/", verifyTokenAndAdmin, getAllUsers);

export default router;
