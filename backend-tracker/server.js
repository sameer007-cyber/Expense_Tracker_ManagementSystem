const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

dotenv.config();

const authRoutes = require("./routes/AuthRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// connect database (same as your older file)
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// root
app.get("/", (req, res) => res.send("Expense Tracker API is running"));

// error handler (basic)
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ success: false, message: "Server Error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
