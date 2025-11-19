import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import Filters from "../components/Filters";
import AddEditModal from "../components/AddEditModal";

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
  const [chartData, setChartData] = useState(null);

  const [filterVisible, setFilterVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchIncome = async (filters = {}) => {
    try {
      const params = new URLSearchParams({
        type: "income",
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
            label: "Income",
            data: data.map((i) => i.amount),
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
              g.addColorStop(0, "#8b5cf6");
              g.addColorStop(1, "#c4b5fd");
              return g;
            },
            borderRadius: 6,
          },
        ],
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const onSave = async (payload) => {
    try {
      if (editing && editing._id) {
        await API.put(`/expenses/${editing._id}`, payload);
      } else {
        await API.post("/expenses", payload);
      }
      setModalVisible(false);
      setEditing(null);
      fetchIncome();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const onDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchIncome();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <Navbar title="Income" />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={() => setFilterVisible(true)} className="px-3 py-2 border rounded hover:bg-gray-50">Filters</button>
          <button onClick={() => { setModalVisible(true); setEditing(null); }} className="px-3 py-2 bg-purple-600 text-white rounded shadow">+ Add Income</button>
        </div>

        <Filters
          type="income"
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={(f) => fetchIncome(f)}
        />

        {chartData && (
          <div className="bg-white p-6 mt-6 rounded shadow">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Income Overview</h3>
            </div>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#6d28d9",
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 },
                    padding: 10,
                    displayColors: false,
                  },
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                  x: { grid: { display: false } },
                },
                elements: {
                  bar: { borderRadius: 6 },
                },
              }}
            />
          </div>
        )}

        <div className="bg-white p-6 mt-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Income Sources</h4>
            <button className="px-3 py-1 border rounded" onClick={() => {
              const csv = [
                ["Title","Amount","Category","Date"],
                ...items.map(i => [i.title, i.amount, i.category, new Date(i.date).toLocaleDateString()])
              ].map(r => r.join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "income.csv"; a.click(); URL.revokeObjectURL(url);
            }}>Download</button>
          </div>

          <ul className="space-y-3">
            {items.map(it => (
              <li key={it._id} className="flex justify-between items-center border-b py-3">
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-500">{new Date(it.date).toDateString()}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-green-600 font-semibold">+ ₹{it.amount}</div>
                  <button onClick={() => { setEditing(it); setModalVisible(true); }} className="text-blue-600 text-sm">Edit</button>
                  <button onClick={() => onDelete(it._id)} className="text-red-600 text-sm">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <AddEditModal
          visible={modalVisible}
          initial={editing}
          onClose={() => { setModalVisible(false); setEditing(null); }}
          onSave={onSave}
          defaultType="income"
        />
      </div>
    </div>
  );
}
