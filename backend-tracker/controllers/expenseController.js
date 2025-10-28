const Expense = require("../models/expenseModel");

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: expenses.length, expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching expenses" });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || !amount || !category || !date)
      return res.status(400).json({ message: "All fields are required" });

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      user: req.user._id,
    });

    res.status(201).json({ success: true, message: "Expense added", expense });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding expense" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense)
      return res.status(404).json({ success: false, message: "Expense not found" });

    res.json({ success: true, message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting expense" });
  }
};
