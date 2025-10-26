const Expense = require("../models/expenseModel");

// GET all
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses.map(e => ({ ...e._doc, id: e._id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createExpense = async (req, res) => {
  try {
    const exp = await Expense.create(req.body);
    res.json({ ...exp._doc, id: exp._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ✅
exports.updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ ...updated._doc, id: updated._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
