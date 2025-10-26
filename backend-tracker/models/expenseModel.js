const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
