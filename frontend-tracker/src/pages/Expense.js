import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import Filters from "../components/Filters";
import AddEditModal from "../components/AddEditModal";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { SlidersHorizontal, Plus, Pencil, Trash2, TrendingDown, Receipt } from "lucide-react";

const DANGER = "#f04f5e";

const CustomTooltip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 px-3.5 py-2.5 text-xs">
      <p className="text-slate-400 font-semibold mb-1">{label}</p>
      <p className="font-extrabold" style={{ color: DANGER }}>₹{payload[0].value?.toLocaleString()}</p>
    </div>
  ) : null;

export default function Expense() {
  const [items, setItems]         = useState([]);
  const [chartData, setChartData] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [modalVisible, setModalVisible]   = useState(false);
  const [editing, setEditing]     = useState(null);

  const fetchExpenses = async (filters = {}) => {
    try {
      const params = new URLSearchParams({
        type: "expense",
        ...(filters.category  && { category:  filters.category }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate   && { endDate:   filters.endDate }),
      });
      const res  = await API.get(`/expenses?${params}`);
      const data = res.data.expenses || [];
      setItems(data);
      setChartData(
        data.map(i => ({
          date:   new Date(i.date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
          amount: i.amount,
        }))
      );
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const onSave = async (payload) => {
    try {
      if (editing?._id) await API.put(`/expenses/${editing._id}`, payload);
      else              await API.post("/expenses", payload);
      setModalVisible(false); setEditing(null); fetchExpenses();
    } catch (err) { console.error(err); }
  };

  const onDelete = async (id) => {
    try { await API.delete(`/expenses/${id}`); fetchExpenses(); }
    catch (err) { console.error(err); }
  };

  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <Navbar title="Expenses" />

        {/* ── Top summary + actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          {/* Quick stat */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 border" style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${DANGER}18` }}>
              <TrendingDown size={18} style={{ color: DANGER }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>Total Expenses</p>
              <p className="text-xl font-extrabold num" style={{ color: DANGER }}>₹{total.toLocaleString()}</p>
            </div>
            <div className="ml-4 pl-4 border-l border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>Entries</p>
              <p className="text-xl font-extrabold num text-slate-700">{items.length}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setFilterVisible(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border transition-base"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-2)" }}
            >
              <SlidersHorizontal size={14} /> Filters
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setModalVisible(true); setEditing(null); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl shadow-md"
              style={{ background: `linear-gradient(90deg,${DANGER},#e11d48)`, boxShadow: `0 4px 16px ${DANGER}40` }}
            >
              <Plus size={14} /> Add Expense
            </motion.button>
          </div>
        </div>

        <Filters type="expense" visible={filterVisible} onClose={() => setFilterVisible(false)} onApply={fetchExpenses} />

        {/* ── Area chart ── */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border p-6 mb-5"
            style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-extrabold text-slate-800">Expense Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Amount over time</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={DANGER} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={DANGER} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke={DANGER} strokeWidth={2.5}
                  fill="url(#expG)" dot={{ fill: DANGER, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: DANGER, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* ── List ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
        >
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <Receipt size={15} className="text-slate-400" />
              <h4 className="font-extrabold text-slate-800">All Expenses</h4>
            </div>
            <span className="text-xs font-bold bg-rose-50 text-rose-500 border border-rose-100 px-2.5 py-1 rounded-full">
              {items.length} entries
            </span>
          </div>

          <ul>
            {items.map((it, i) => (
              <motion.li
                key={it._id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.035 }}
                className="flex justify-between items-center px-6 py-3.5 border-b last:border-0 hover:bg-rose-50/30 transition-colors group"
                style={{ borderColor: "#fafafa" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0"
                    style={{ background: `${DANGER}18`, color: DANGER }}>
                    {it.title?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{it.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {new Date(it.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {it.category && (
                        <span className="ml-2 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">
                          {it.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm num" style={{ color: DANGER }}>
                    −₹{it.amount?.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditing(it); setModalVisible(true); }}
                      className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-500 transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => onDelete(it._id)}
                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
            {items.length === 0 && (
              <li className="px-6 py-14 text-center text-slate-400 text-sm">No expenses recorded yet</li>
            )}
          </ul>
        </motion.div>

        <AddEditModal
          visible={modalVisible} initial={editing}
          onClose={() => { setModalVisible(false); setEditing(null); }}
          onSave={onSave} defaultType="expense"
        />
      </div>
    </div>
  );
}