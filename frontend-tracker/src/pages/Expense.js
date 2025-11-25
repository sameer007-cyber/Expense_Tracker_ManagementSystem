import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import Filters from "../components/Filters";
import AddEditModal from "../components/AddEditModal";

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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Expense() {
  const [items, setItems] = useState([]);
  const [chartData, setChartData] = useState(null);

  const [filterVisible, setFilterVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchExpenses = async (filters = {}) => {
    try {
      const params = new URLSearchParams({
        type: "expense",
        ...(filters.category && { category: filters.category }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const res = await API.get(`/expenses?${params.toString()}`);
      const data = res.data.expenses || [];

      setItems(data);

      const labels = data.map((i) =>
        new Date(i.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })
      );

      setChartData({
        labels,
        datasets: [
          {
            label: "Expenses",
            data: data.map((i) => i.amount),
            borderColor: "#8b5cf6",
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
              g.addColorStop(0, "rgba(139,92,246,0.35)");
              g.addColorStop(1, "rgba(139,92,246,0.08)");
              return g;
            },
            fill: true,
            tension: 0.55,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: "#7c3aed",
          },
        ],
      });
    } catch (err) {
      console.error("fetchExpenses error:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onSave = async (payload) => {
    try {
      if (editing && editing._id) {
        // PUT request for editing
        await API.put(`/expenses/${editing._id}`, payload);
      } else {
        // POST request for new expense
        await API.post("/expenses", payload);
      }

      setModalVisible(false);
      setEditing(null);
      fetchExpenses();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const onDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <Navbar title="Expense" />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setFilterVisible(true)}
            className="px-3 py-2 border rounded hover:bg-gray-50"
          >
            Filters
          </button>

          <button
            onClick={() => {
              setModalVisible(true);
              setEditing(null);
            }}
            className="px-3 py-2 bg-purple-600 text-white rounded shadow"
          >
            + Add Expense
          </button>
        </div>

        {/* Filters */}
        <Filters
          type="expense"
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={(f) => fetchExpenses(f)}
        />

        {/* CHART */}
        {chartData && (
          <div className="bg-white p-6 mt-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-3">Expense Overview</h3>
            <Line data={chartData} />
          </div>
        )}

        {/* LIST */}
        <div className="bg-white p-6 mt-6 rounded shadow">
          <h4 className="font-semibold mb-4">All Expenses</h4>

          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={it._id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(it.date).toDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-red-600 font-semibold">₹{it.amount}</div>
                  <button
                    onClick={() => {
                      setEditing(it);
                      setModalVisible(true);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(it._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <AddEditModal
          visible={modalVisible}
          initial={editing}
          onClose={() => {
            setModalVisible(false);
            setEditing(null);
          }}
          onSave={onSave}
          defaultType="expense"
        />
      </div>
    </div>
  );
}
