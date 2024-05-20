import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userControllers.js";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../middleware/verifyJWT.js";

const router = express.Router();

router.put("/:id", verifyTokenAndAuthorization, updateUser);
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  deleteUser
);
router.get("/:id", verifyTokenAndAuthorization, getUser);
router.get("/", verifyTokenAndAdmin, getAllUsers);

export default router;
