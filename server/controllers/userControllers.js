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
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
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
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const query = req.query.new;
    let users;

    if (query) {
      // If query is specified, sort by creation date
      users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    } else {
      // Otherwise, fetch all users and exclude the password field
      users = await User.find().select("-password").skip(skip).limit(limit);
    }

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages,
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

    // Update the user's role to admin by setting isAdmin to true
    user.isAdmin = true;
    await user.save();

    res.status(200).json({ message: "User has been made an admin" });
  } catch (error) {
    console.error("Error making user an admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
