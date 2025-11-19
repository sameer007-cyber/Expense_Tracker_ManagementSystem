import React, { useEffect, useState } from "react";

export default function Filters({ type, visible, onClose, onApply }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [range, setRange] = useState({ start: "", end: "" });

  const loadCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/expenses?type=${type}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const data = await res.json();
      if (data.expenses) {
        const unique = [...new Set(data.expenses.map((x) => x.category || "Other"))];
        setCategoryList(unique);
      }
    } catch (err) {
      console.error("Load categories failed", err);
    }
  };

  useEffect(() => {
    if (visible) loadCategories();
  }, [visible, type]);

  const apply = () => {
    onApply({
      category: selectedCategory,
      startDate: range.start || undefined,
      endDate: range.end || undefined,
    });
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categoryList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={range.start}
                onChange={(e) => setRange({ ...range, start: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={range.end}
                onChange={(e) => setRange({ ...range, end: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-2 border rounded" onClick={() => {
              // quick filters: today, 7 days, 30 days, month
              const end = new Date();
              const start = new Date();
              start.setDate(end.getDate() - 6); // last 7 days
              setRange({
                start: start.toISOString().split("T")[0],
                end: end.toISOString().split("T")[0],
              });
            }}>Last 7 Days</button>

            <button className="px-3 py-2 border rounded" onClick={() => {
              const end = new Date();
              const start = new Date();
              start.setDate(end.getDate() - 29);
              setRange({
                start: start.toISOString().split("T")[0],
                end: end.toISOString().split("T")[0],
              });
            }}>Last 30 Days</button>

            <button className="ml-auto px-3 py-2 bg-purple-600 text-white rounded" onClick={apply}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
