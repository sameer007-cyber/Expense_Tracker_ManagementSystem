const Expense = require("../models/expenseModel");

exports.getExpenses = async (req, res) => {
  try {
    // Optionally support query filters: startDate, endDate, category
    const { startDate, endDate, category } = req.query;
    const filter = { user: req.user._id };

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: expenses.length, expenses });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ success: false, message: "Error fetching expenses" });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || amount == null || !category || !date)
      return res.status(400).json({ message: "All fields are required" });

    const expense = await Expense.create({
      title,
      amount,
      category,
      date: new Date(date),
      user: req.user._id,
    });

    res.status(201).json({ success: true, message: "Expense added", expense });
  } catch (err) {
    console.error("Error adding expense:", err);
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
    console.error("Error deleting expense:", err);
    res.status(500).json({ success: false, message: "Error deleting expense" });
  }
};
