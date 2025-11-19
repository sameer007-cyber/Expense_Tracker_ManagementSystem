const express = require("express");
const {
  getExpenses,
  addExpense,
  deleteExpense,
  getSummary,
} = require("../controllers/expenseController");
const { protect } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getExpenses);
router.post("/", addExpense);
router.delete("/:id", deleteExpense);
router.get("/summary", getSummary); // FIXED

module.exports = router;
