import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Expense() {
  const [items, setItems] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses?type=expense");
      setItems(res.data.expenses);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const labels = items.map((i) =>
    new Date(i.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    })
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: items.map((i) => i.amount),
        borderColor: "#8b5cf6",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(139,92,246,0.5)");
          gradient.addColorStop(1, "rgba(139,92,246,0.1)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#8b5cf6",
      },
    ],
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar title="Expense" />

        <div className="bg-white p-6 rounded shadow mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl">Expense Overview</h2>
            <button className="px-4 py-2 bg-purple-600 text-white rounded">
              + Add Expense
            </button>
          </div>

          <Line data={chartData} height={90} />
        </div>

        {/* Expense List */}
        <div className="bg-white p-6 rounded shadow mt-6">
          <h2 className="font-semibold text-lg mb-4">All Expenses</h2>

          {items.map((i) => (
            <div
              key={i._id}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-medium">{i.title}</p>
                <p className="text-sm text-gray-600">
                  {new Date(i.date).toDateString()}
                </p>
              </div>
              <p className="text-red-500 font-semibold">- ${i.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
