import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import axios from "axios";

const API = "http://localhost:4000/api/expenses";

export default function ExpensesPage({ token }) {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const res = await axios.get(API, { headers });
      setExpenses(res.data.expenses);
    } catch {
      setMessage("Failed to load expenses");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (exp) => {
    try {
      const res = await axios.post(API, exp, { headers });
      setExpenses([res.data.expense, ...expenses]);
      setMessage("Expense added!");
    } catch {
      setMessage("Create failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, { headers });
      setExpenses(expenses.filter((e) => e._id !== id));
      setMessage("Deleted!");
    } catch {
      setMessage("Delete failed");
    }
  };

  return (
    <div className="panel">
      <ExpenseForm onSubmit={handleCreate} />

      {message && <div className="info">{message}</div>}

      <ExpenseList expenses={expenses} onDelete={handleDelete} />
    </div>
  );
}
