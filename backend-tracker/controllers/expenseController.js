import Expense from "../models/expenseModel.js";

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add expense
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    if (!title || !amount || !category)
      return res.status(400).json({ message: "All fields are required" });

    const newExpense = await Expense.create({ title, amount, category });
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense)
      return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
