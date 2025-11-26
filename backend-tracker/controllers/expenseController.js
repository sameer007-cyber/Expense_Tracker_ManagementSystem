const Expense = require("../models/expenseModel");

exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, expenses });
  } catch (err) {
    console.error("getExpenses error:", err);
    res.status(500).json({ success: false });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, type } = req.body;

    if (!title || !amount || !category || !date || !type)
      return res.status(400).json({ message: "All fields are required" });

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      type,
      user: req.user._id,
    });

    res.json({ success: true, expense });
  } catch (err) {
    console.error("addExpense error:", err);
    res.status(500).json({ success: false });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) return res.status(404).json({ success: false });

    res.json({ success: true });
  } catch (err) {
    console.error("delete error:", err);
    res.status(500).json({ success: false });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const uid = req.user._id;

    const incomeAgg = await Expense.aggregate([
      { $match: { user: uid, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expenseAgg = await Expense.aggregate([
      { $match: { user: uid, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpense = expenseAgg[0]?.total || 0;

    res.json({
      success: true,
      totalIncome,
      totalExpense,
      remaining: totalIncome - totalExpense,
    });
  } catch (err) {
    console.error("summary error:", err);
    res.status(500).json({ success: false });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, type } = req.body;

    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, amount, category, date, type },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Expense not found" });

    res.json({ success: true, expense: updated });
  } catch (err) {
    console.error("update error:", err);
    res.status(500).json({ success: false });
  }
};
