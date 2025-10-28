const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/AuthRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// connect database
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
