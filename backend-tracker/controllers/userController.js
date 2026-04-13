const User = require("../models/UserModel");
const Expense = require("../models/expenseModel");
const bcrypt = require("bcryptjs");

exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username)
      return res.status(400).json({ message: "Username is required" });

    req.user.username = username;
    await req.user.save();

    res.json({
      success: true,
      user: {
        _id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    console.error("updateProfile:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const valid = await bcrypt.compare(oldPassword, req.user.password);
    if (!valid)
      return res.status(400).json({ message: "Incorrect old password" });

    req.user.password = newPassword;
    await req.user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error("changePassword:", err);
    res.status(500).json({ message: "Password change failed" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await Expense.deleteMany({ user: req.user._id });
    await User.deleteOne({ _id: req.user._id });
    res.json({ success: true });
  } catch (err) {
    console.error("deleteAccount:", err);
    res.status(500).json({ message: "Account deletion failed" });
  }
};
