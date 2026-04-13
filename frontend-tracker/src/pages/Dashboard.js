import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area,
} from "recharts";
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight,
  ArrowDownRight, Zap, Activity,
} from "lucide-react";

/* ─── Animation variant ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [.22,1,.36,1] },
  }),
};

/* ─── Colours ────────────────────────────────────────────── */
const C = { primary: "#5b5ef4", success: "#00c896", danger: "#f04f5e", warning: "#f59e0b" };

/* ─── Custom tooltips ────────────────────────────────────── */
const PieTooltip = ({ active, payload }) =>
  active && payload?.length ? (
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 px-3.5 py-2 text-sm font-semibold text-slate-700">
      {payload[0].name}: ₹{payload[0].value?.toLocaleString()}
    </div>
  ) : null;

const BarTooltip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="bg-white rounded-xl shadow-xl border border-slate-100 px-3.5 py-2.5 text-xs">
      <p className="text-slate-400 mb-1.5 font-semibold">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="font-bold" style={{ color: p.fill }}>
          {p.name}: ₹{p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  ) : null;

/* ─── Stat card ──────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, accent, trend, sub, index }) {
  return (
    <motion.div
      variants={fadeUp} initial="hidden" animate="show" custom={index}
      className="bg-white rounded-2xl p-5 border card-hover cursor-default"
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
    >
      {/* top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${accent}18` }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>
        {trend && (
          <span
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full"
            style={{ background: `${trend > 0 ? C.success : C.danger}15`, color: trend > 0 ? C.success : C.danger }}
          >
            {trend > 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-3)" }}>{label}</p>
      <h2 className="text-2xl font-extrabold num" style={{ color: "var(--text-1)" }}>
        ₹{value?.toLocaleString() ?? "0"}
      </h2>
      {sub && <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>{sub}</p>}
    </motion.div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────── */
export default function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, remaining: 0 });
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const loadSummary = async () => {
    try { setSummary((await api.get("/expenses/summary")).data); }
    catch (e) { console.error(e); }
  };

  const loadTransactions = async () => {
    try {
      const [expR, incR] = await Promise.all([
        api.get("/expenses?type=expense"),
        api.get("/expenses?type=income"),
      ]);
      const merged = [...expR.data.expenses, ...incR.data.expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
      setTransactions(merged);

      /* Build monthly comparison */
      const map = {};
      [...expR.data.expenses, ...incR.data.expenses].forEach(tx => {
        const dt = new Date(tx.date);
        const key = dt.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        if (!map[key]) map[key] = { month: key, income: 0, expenses: 0 };
        if (tx.type === "income") map[key].income += tx.amount;
        else map[key].expenses += tx.amount;
      });
      setMonthlyData(Object.values(map).slice(-6));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadSummary(); loadTransactions(); }, []);

  const savingsRate = summary.totalIncome > 0
    ? Math.round(((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100)
    : 0;

  const pieData = [
    { name: "Expenses", value: summary.totalExpense },
    { name: "Savings",  value: Math.max(0, summary.remaining) },
  ];

  return (
    <div className="flex" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <Navbar title="Dashboard" />

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <StatCard index={0} label="Net Balance"     value={summary.remaining}    icon={Wallet}      accent={C.primary} />
          <StatCard index={1} label="Total Income"    value={summary.totalIncome}  icon={TrendingUp}  accent={C.success} trend={null} />
          <StatCard index={2} label="Total Expenses"  value={summary.totalExpense} icon={TrendingDown} accent={C.danger}  />
        </div>

        {/* ── Savings rate banner ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="rounded-2xl p-4 mb-5 flex items-center justify-between gap-4"
          style={{
            background: "linear-gradient(105deg,#5b5ef4 0%,#7c3aed 100%)",
            boxShadow: "0 8px 32px rgba(91,94,244,.3)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Savings Rate</p>
              <p className="text-white font-extrabold text-lg num">{savingsRate}%</p>
            </div>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </div>
          <div className="text-white/80 text-xs font-semibold hidden sm:block">
            ₹{Math.max(0, summary.remaining).toLocaleString()} saved
          </div>
        </motion.div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

          {/* Monthly comparison bar chart */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="lg:col-span-2 bg-white rounded-2xl p-6 border"
            style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-extrabold text-slate-800">Monthly Overview</h3>
                <p className="text-xs text-slate-400 mt-0.5">Income vs Expenses</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                <Activity size={11} /> Last 6 months
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={monthlyData} barGap={4} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Plus Jakarta Sans" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "Plus Jakarta Sans" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(91,94,244,.05)", radius: 8 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "Plus Jakarta Sans", color: "#64748b" }} />
                <Bar dataKey="income"   name="Income"   fill={C.success} radius={[6,6,0,0]} maxBarSize={32} />
                <Bar dataKey="expenses" name="Expenses" fill={C.danger}  radius={[6,6,0,0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Donut + legend */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="bg-white rounded-2xl p-6 border flex flex-col"
            style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
          >
            <h3 className="font-extrabold text-slate-800 mb-1">Allocation</h3>
            <p className="text-xs text-slate-400 mb-4">Expenses vs Savings</p>

            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill={C.danger}  strokeWidth={0} />
                  <Cell fill={C.success} strokeWidth={0} />
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-auto space-y-2.5">
              {[
                { label: "Expenses", value: summary.totalExpense, color: C.danger },
                { label: "Savings",  value: Math.max(0, summary.remaining), color: C.success },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-xs font-medium text-slate-500">{label}</span>
                  </div>
                  <span className="text-xs font-bold num text-slate-700">₹{value?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Recent Transactions ── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="bg-white rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
        >
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <div>
              <h3 className="font-extrabold text-slate-800">Recent Transactions</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last {transactions.length} entries</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
              Latest 6
            </span>
          </div>

          <ul>
            {transactions.length === 0 && (
              <li className="px-6 py-14 text-center text-slate-400 text-sm">No transactions yet</li>
            )}
            {transactions.map((tx, i) => (
              <motion.li
                key={tx._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.055 }}
                className="flex justify-between items-center px-6 py-3.5 border-b last:border-0 hover:bg-slate-50/80 transition-colors"
                style={{ borderColor: "#f8fafc" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0"
                    style={{
                      background: tx.type === "income" ? `${C.success}18` : `${C.danger}18`,
                      color: tx.type === "income" ? C.success : C.danger,
                    }}
                  >
                    {tx.title?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{tx.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {tx.category && (
                        <span className="ml-2 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">
                          {tx.category}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-extrabold num"
                  style={{ color: tx.type === "income" ? C.success : C.danger }}
                >
                  {tx.type === "income" ? "+" : "−"}₹{tx.amount?.toLocaleString()}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}