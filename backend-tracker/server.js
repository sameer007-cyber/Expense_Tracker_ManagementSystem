const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/AuthRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// middlewares
app.use(cors({
  origin: "https://expense-tracker-managementsystem.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());


// connect database
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

// root
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({
    success: false,
    message: "Server Error",
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
