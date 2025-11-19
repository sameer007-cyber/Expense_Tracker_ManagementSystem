import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Income() {
  const [items, setItems] = useState([]);

  const fetchIncome = async () => {
    try {
      const res = await API.get("/expenses?type=income");
      setItems(res.data.expenses);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchIncome();
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
        label: "Income",
        data: items.map((i) => i.amount),
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "#8b5cf6"); // Purple
          gradient.addColorStop(1, "#c4b5fd"); // Light purple
          return gradient;
        },
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar title="Income" />

        <div className="bg-white p-6 rounded shadow mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl">Income Overview</h2>
            <button className="px-4 py-2 bg-purple-600 text-white rounded">
              + Add Income
            </button>
          </div>

          <Bar data={chartData} height={100} />
        </div>

        {/* Income Sources list */}
        <div className="bg-white p-6 rounded shadow mt-6">
          <h2 className="font-semibold text-lg mb-4">Income Sources</h2>

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
              <p className="text-green-600 font-semibold">+ ${i.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
