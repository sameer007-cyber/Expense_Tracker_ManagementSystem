const express = require("express");
const { getExpenses, addExpense, deleteExpense } = require("../controllers/expenseController");
const { protect } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.use(protect); // all routes protected
router.get("/", getExpenses);
router.post("/", addExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
