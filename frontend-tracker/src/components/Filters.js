import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Calendar, Tag, Clock, RotateCcw } from "lucide-react";

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export default function Filters({ type, visible, onClose, onApply }) {
  const [categoryList, setCategoryList]       = useState([]);
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
        setCategoryList([...new Set(data.expenses.map(x => x.category || "Other"))]);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (visible) loadCategories(); }, [visible, type]);

  const apply = () => {
    onApply({ category: selectedCategory, startDate: range.start || undefined, endDate: range.end || undefined });
    onClose();
  };

  const clear = () => { setSelectedCategory(""); setRange({ start: "", end: "" }); };

  const setLastN = (n) => {
    const end = new Date(), start = new Date();
    start.setDate(end.getDate() - (n - 1));
    setRange({ start: start.toISOString().split("T")[0], end: end.toISOString().split("T")[0] });
  };

  const hasFilters = selectedCategory || range.start || range.end;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(8,13,26,.6)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 440, damping: 34 }}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <SlidersHorizontal size={14} className="text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">Filter</h3>
                  <p className="text-[10px] text-slate-400 capitalize">{type} entries</p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Category */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Tag size={10} /> Category
                </label>
                <select className={inputCls} value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {categoryList.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar size={10} /> Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className={inputCls} value={range.start}
                    onChange={e => setRange({ ...range, start: e.target.value })} />
                  <input type="date" className={inputCls} value={range.end}
                    onChange={e => setRange({ ...range, end: e.target.value })} />
                </div>
              </div>

              {/* Quick ranges */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Clock size={10} /> Quick Select
                </label>
                <div className="flex gap-2">
                  {[7, 14, 30, 90].map(n => (
                    <button key={n} onClick={() => setLastN(n)}
                      className="flex-1 py-2 text-xs font-bold rounded-xl border transition-all"
                      style={{
                        background: range.start && new Date(range.start).toDateString() === (() => { const d = new Date(); d.setDate(d.getDate()-(n-1)); return d.toDateString(); })() ? "#eef2ff" : "#f8fafc",
                        borderColor: "#e2e8f0",
                        color: "#5b5ef4",
                      }}>
                      {n}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-1">
                {hasFilters && (
                  <button onClick={clear}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-base"
                    style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                    <RotateCcw size={11} /> Clear
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={apply}
                  className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl shadow-md"
                  style={{ background: "linear-gradient(90deg,#5b5ef4,#4f46e5)", boxShadow: "0 4px 14px rgba(91,94,244,.3)" }}>
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}