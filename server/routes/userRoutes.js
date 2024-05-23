import express from "express";
import {
  deleteUser,
  getAllUsers,
  makeUserAnAdmin,
  updateUser,
  deleteMyInfo,
  getMyInfo,
} from "../controllers/userControllers.js";
import { verifyJWT, verifyTokenAndAdmin } from "../middleware/verifyJWT.js";
import { validateUpdateUser } from "../middleware/validate.js";

const router = express.Router();

router.put("/", verifyJWT, validateUpdateUser, updateUser);
//user to delete info
router.delete("/me", verifyJWT, deleteMyInfo);
router.get("/me", verifyJWT, getMyInfo);
//admin to get all user
router.get("/", verifyTokenAndAdmin, getAllUsers);
//admin to delete user
router.delete("/:id", verifyJWT, verifyTokenAndAdmin, deleteUser);
//make user an admin
router.patch("/:id", verifyTokenAndAdmin, makeUserAnAdmin);

export default router;
