import bcrypt from "bcrypt";
import User from "../models/userModel.js";

export const updateUser = async (req, res) => {
  try {
    const allowedUpdates = ["fullname", "email"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ error: "Invalid updates!" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.decoded.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .select("-password")
      .select("-isAdmin");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req.decoded.id).select("-password");
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).json();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req.decoded.id)
      .select("-password")
      .select("-isAdmin");
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all users
export const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    let currentPage = page;
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    const skip = (currentPage - 1) * limit;

    const query = req.query.new;
    let users;
    if (query) {
      users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    } else {
      users = await User.find().select("-password").skip(skip).limit(limit);
    }

    res.status(200).json({
      users,
      pagination: {
        currentPage,
        totalPages,
        totalUsers,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const makeUserAnAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isAdmin = true;
    await user.save();

    res.status(200).json({ message: "User has been made an admin" });
  } catch (error) {
    console.error("Error making user an admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
