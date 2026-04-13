import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const PALETTE = ["#5b5ef4","#00c896","#f04f5e","#f59e0b","#8b5cf6","#06b6d4","#ec4899","#14b8a6"];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i=0) => ({ opacity: 1, y: 0, transition: { delay: i*.1, duration: .4, ease: [.22,1,.36,1] } }),
};

const chartDefaults = {
  plugins: {
    legend: { labels: { font: { family: "Plus Jakarta Sans", size: 12, weight: "600" }, padding: 16, usePointStyle: true, pointStyle: "circle" } },
    tooltip: {
      backgroundColor: "#fff",
      titleColor: "#0f172a",
      bodyColor: "#5b5ef4",
      borderColor: "#e8edf8",
      borderWidth: 1,
      padding: 12,
      titleFont: { family: "Plus Jakarta Sans", size: 12, weight: "600" },
      bodyFont: { family: "DM Mono", size: 13, weight: "500" },
      callbacks: { label: ctx => ` ₹${ctx.parsed?.toLocaleString?.() ?? ctx.parsed.y?.toLocaleString()}` },
    },
  },
};

export default function ExpenseCharts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try { setItems((await API.get("/expenses")).data.expenses); }
      catch (err) { console.error(err); }
    })();
  }, []);

  /* ── Category donut ── */
  const categories = [...new Set(items.map(i => i.category || "Other"))];
  const catTotals  = categories.map(c => items.filter(i => i.category === c).reduce((s,it) => s + it.amount, 0));

  /* ── Monthly bar ── */
  const monthly = {};
  items.forEach(i => {
    const dt = new Date(i.date);
    const key = dt.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthly[key] = (monthly[key] || 0) + i.amount;
  });
  const months = Object.keys(monthly).sort();

  /* ── Type split ── */
  const incomeTotal  = items.filter(i => i.type === "income").reduce((s,i) => s + i.amount, 0);
  const expenseTotal = items.filter(i => i.type === "expense").reduce((s,i) => s + i.amount, 0);

  const doughData = {
    labels: categories,
    datasets: [{ data: catTotals, backgroundColor: PALETTE, borderWidth: 0, hoverOffset: 8 }],
  };

  const barData = {
    labels: months,
    datasets: [{
      label: "Total Amount",
      data: months.map(m => monthly[m]),
      backgroundColor: months.map((_,i) => PALETTE[i % PALETTE.length] + "cc"),
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const splitData = {
    labels: ["Income", "Expenses"],
    datasets: [{ data: [incomeTotal, expenseTotal], backgroundColor: ["#00c896","#f04f5e"], borderWidth: 0, hoverOffset: 8 }],
  };

  const barOpts = {
    ...chartDefaults,
    responsive: true,
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: "Plus Jakarta Sans", size: 11 }, color: "#94a3b8" } },
      y: { grid: { color: "#f1f5f9" }, border: { dash: [4,4] }, ticks: { font: { family: "Plus Jakarta Sans", size: 11 }, color: "#94a3b8", callback: v => `₹${(v/1000).toFixed(0)}k` } },
    },
  };

  const doughOpts = {
    ...chartDefaults,
    cutout: "70%",
    plugins: {
      ...chartDefaults.plugins,
      legend: { ...chartDefaults.plugins.legend, position: "bottom" },
    },
  };

  const summaryStats = [
    { label: "Categories",     value: categories.length,         color: "#5b5ef4" },
    { label: "Total Income",   value: `₹${incomeTotal.toLocaleString()}`,  color: "#00c896" },
    { label: "Total Expenses", value: `₹${expenseTotal.toLocaleString()}`, color: "#f04f5e" },
    { label: "Net Balance",    value: `₹${(incomeTotal - expenseTotal).toLocaleString()}`, color: "#f59e0b" },
  ];

  return (
    <div className="flex" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <Navbar title="Analytics" />

        {/* ── Summary row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {summaryStats.map(({ label, value, color }, i) => (
            <motion.div key={label} variants={fadeUp} initial="hidden" animate="show" custom={i}
              className="bg-white rounded-2xl p-4 border text-center card-hover cursor-default"
              style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
              <div className="w-2 h-2 rounded-full mx-auto mb-2" style={{ background: color }} />
              <p className="text-[10px] font-extrabold uppercase tracking-widest mb-1" style={{ color: "var(--text-3)" }}>{label}</p>
              <p className="text-base font-extrabold num" style={{ color }}>{value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Category donut */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="bg-white rounded-2xl border p-6"
            style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="mb-5">
              <h3 className="font-extrabold text-slate-800">Spending by Category</h3>
              <p className="text-xs text-slate-400 mt-0.5">Breakdown of all transactions</p>
            </div>
            {categories.length > 0
              ? <div className="h-72 flex items-center justify-center"><Doughnut data={doughData} options={doughOpts} /></div>
              : <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
            }
          </motion.div>

          {/* Income vs Expenses donut */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="bg-white rounded-2xl border p-6"
            style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
            <div className="mb-5">
              <h3 className="font-extrabold text-slate-800">Income vs Expenses</h3>
              <p className="text-xs text-slate-400 mt-0.5">Overall financial split</p>
            </div>
            {(incomeTotal + expenseTotal) > 0
              ? <div className="h-72 flex items-center justify-center"><Doughnut data={splitData} options={doughOpts} /></div>
              : <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
            }
          </motion.div>
        </div>

        {/* Monthly bar */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
          className="bg-white rounded-2xl border p-6"
          style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="mb-5">
            <h3 className="font-extrabold text-slate-800">Monthly Spending</h3>
            <p className="text-xs text-slate-400 mt-0.5">Total amount per month</p>
          </div>
          {months.length > 0
            ? <div className="h-64"><Bar data={barData} options={barOpts} /></div>
            : <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          }
        </motion.div>
      </div>
    </div>
  );
}