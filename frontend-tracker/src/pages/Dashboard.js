import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    remaining: 0,
  });

  const [transactions, setTransactions] = useState([]);

  const loadSummary = async () => {
    try {
      const res = await api.get("/expenses/summary");
      setSummary(res.data);
    } catch (e) {
      console.error("Summary error:", e);
    }
  };

  const loadTransactions = async () => {
    try {
      const expenseRes = await api.get("/expenses?type=expense");
      const incomeRes = await api.get("/expenses?type=income");

      const merged = [...expenseRes.data.expenses, ...incomeRes.data.expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setTransactions(merged);
    } catch (e) {
      console.error("Transaction error:", e);
    }
  };

  useEffect(() => {
    loadSummary();
    loadTransactions();
  }, []);

  const data = {
    labels: ["Income", "Expenses", "Balance"],
    datasets: [
      {
        data: [
          summary.totalIncome,
          summary.totalExpense,
          summary.remaining,
        ],
        backgroundColor: ["#f59e0b", "#dc2626", "#6366f1"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar title="Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          <div className="bg-white shadow rounded p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Balance</p>
              <h2 className="text-3xl font-semibold text-purple-600">
                ₹{summary.remaining}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              💰
            </div>
          </div>

          <div className="bg-white shadow rounded p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Income</p>
              <h2 className="text-3xl font-semibold text-yellow-600">
                ₹{summary.totalIncome}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              📈
            </div>
          </div>

          <div className="bg-white shadow rounded p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Expenses</p>
              <h2 className="text-3xl font-semibold text-red-600">
                ₹{summary.totalExpense}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              📉
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

          <div className="lg:col-span-2 bg-white shadow p-6 rounded">
            <h3 className="text-xl font-semibold mb-4">
              Recent Transactions
            </h3>

            {transactions.length === 0 && (
              <p className="text-gray-500">No transactions yet</p>
            )}

            <ul>
              {transactions.map((tx) => (
                <li
                  key={tx._id}
                  className="flex justify-between items-center border-b py-3"
                >
                  <div>
                    <p className="font-medium">{tx.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.date).toDateString()}
                    </p>
                  </div>

                  <span
                    className={`font-semibold ${
                      tx.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}₹{tx.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow p-6 rounded flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>

            <div className="w-64 h-64">
              <Doughnut data={data} />
            </div>

            <div className="mt-4">
              <p>
                <span className="text-yellow-500 font-semibold">● Income:</span>{" "}
                ₹{summary.totalIncome}
              </p>
              <p>
                <span className="text-red-600 font-semibold">● Expenses:</span>{" "}
                ₹{summary.totalExpense}
              </p>
              <p>
                <span className="text-purple-600 font-semibold">● Balance:</span>{" "}
                ₹{summary.remaining}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
