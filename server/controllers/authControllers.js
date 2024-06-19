import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import {
  emailRegex,
  formatDataToSend,
  passwordRegex,
} from "../utils/helpers.js";

// post
const signUp = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname) {
      return res.status(400).json({ error: "Fullname is required" });
    }

    if (fullname.length < 3) {
      return res
        .status(400)
        .json({ error: "Fullname must be at least 3 characters long" });
    }
    if (!email.length) {
      return res.status(400).json({ error: "Email address is required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password should be 6 to 20 characters long with numeric, 1 lowercase and 1 uppercase letter",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }
    const hashed_password = await bcrypt.hash(password, 10);

    const user = new User({
      fullname,
      email,
      password: hashed_password,
    });

    const savedUser = await user.save();

    const responseData = formatDataToSend(savedUser);
    return res.status(201).json(responseData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// post
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password cant be empty" });
    }
    if (!email.length) {
      return res.status(400).json({ error: "Email address is required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    return res.status(200).json(formatDataToSend(user));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email.length) {
      return res.status(400).json({ error: "Email address is required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    const token = formatDataToSend(user).token;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset your password",
      text: `Click the link to reset your password: https://nysckit-ng-1.onrender.com/reset_password/${user._id}/${token}`,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ status: "Success", message: "Password reset email sent" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!newPassword) {
      return res.status(400).json({ error: "Password cannot be empty" });
    }
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error:
          "Password should be 6 to 20 characters long with at least one numeric, one lowercase, and one uppercase letter",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findById(id);

    // Update user password and clear reset token fields
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();
    return res
      .status(200)
      .json({ status: "Success", message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while resetting the password" });
  }
};

export default {
  signIn,
  signUp,
  forgotPassword,
  resetPassword,
};
