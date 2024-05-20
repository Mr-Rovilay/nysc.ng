import bcrypt from "bcrypt";
import User from "../models/userModel.js";

import {
  emailRegex,
  formatDataToSend,
  passwordRegex,
} from "../utils/helpers.js";

// post
const signUp = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

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
    delete responseData.password;
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

export default {
  signIn,
  signUp,
};
