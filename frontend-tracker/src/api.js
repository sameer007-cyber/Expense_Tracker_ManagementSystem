import axios from "axios";

const API = "http://localhost:4000/api/expenses";

export const fetchExpenses = async (token) => {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createExpense = async (expense, token) => {
  const res = await axios.post(API, expense, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteExpense = async (id, token) => {
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return true;
};
