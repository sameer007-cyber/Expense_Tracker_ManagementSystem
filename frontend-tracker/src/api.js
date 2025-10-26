import axios from "axios";

const API = "http://localhost:4000/api/expenses";

export const fetchExpenses = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createExpense = async (expense) => {
  const res = await axios.post(API, expense);
  return res.data;
};

export const updateExpense = async (id, expense) => {
  const res = await axios.put(`${API}/${id}`, expense);
  return res.data;
};

export const deleteExpense = async (id) => {
  await axios.delete(`${API}/${id}`);
  return true;
};
