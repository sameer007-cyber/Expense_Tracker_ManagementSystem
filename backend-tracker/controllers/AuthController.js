const User = require("../models/UserModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");

exports.Signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ email, password, username });
    const token = createSecretToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) return res.status(400).json({ message: "Invalid credentials" });

    const token = createSecretToken(user._id);

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
