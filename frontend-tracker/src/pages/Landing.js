import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, ShieldCheck, BarChart2, ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Sparkles,    title: "AI-Powered Insights",   desc: "Smart personalised tips that adapt to your spending patterns automatically." },
  { icon: ShieldCheck, title: "Bank-Grade Security",   desc: "256-bit AES encryption keeps every transaction completely private." },
  { icon: BarChart2,   title: "Live Budget Tracking",  desc: "Set goals, visualise progress, and stay on top of every rupee." },
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "₹2Cr+", label: "Tracked Monthly" },
  { value: "4.9★", label: "User Rating" },
];

export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f3fa" }}>

      {/* ── Navbar ── */}
      <header className="w-full sticky top-0 z-50 border-b"
        style={{ background: "rgba(255,255,255,.85)", backdropFilter: "blur(16px)", borderColor: "#e8edf8" }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#818cf8,#5b5ef4)", boxShadow: "0 0 16px rgba(91,94,244,.35)" }}>
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-[15px] font-extrabold text-slate-800 tracking-tight">FinTrack</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => nav("/login")}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Sign in
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => nav("/signup")}
              className="px-5 py-2 text-sm font-bold text-white rounded-xl shadow-md"
              style={{ background: "linear-gradient(90deg,#5b5ef4,#4f46e5)", boxShadow: "0 4px 16px rgba(91,94,244,.3)" }}>
              Get Started
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={11} /> Now with AI-driven spending analysis
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
              Take control of your<br />
              <span style={{ background: "linear-gradient(90deg,#5b5ef4,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                financial future
              </span>
            </h1>

            <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Track income, manage expenses, and gain real-time insights to grow your wealth — all beautifully in one place.
            </p>

            <div className="flex items-center justify-center gap-3 mb-12">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => nav("/signup")}
                className="flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white rounded-xl shadow-lg"
                style={{ background: "linear-gradient(90deg,#5b5ef4,#4f46e5)", boxShadow: "0 8px 24px rgba(91,94,244,.35)" }}>
                Start for Free <ArrowRight size={14} />
              </motion.button>
              <button onClick={() => nav("/login")}
                className="px-7 py-3.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
                Sign In
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-8">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-400 font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Mock dashboard preview ── */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [.22,1,.36,1] }}
            className="mt-14 rounded-2xl overflow-hidden shadow-2xl border mx-auto max-w-4xl"
            style={{ borderColor: "#e8edf8" }}
          >
            {/* Browser chrome */}
            <div className="h-10 flex items-center px-4 gap-2 border-b" style={{ background: "#f8fafc", borderColor: "#e8edf8" }}>
              <div className="w-3 h-3 rounded-full bg-red-300" />
              <div className="w-3 h-3 rounded-full bg-amber-300" />
              <div className="w-3 h-3 rounded-full bg-green-300" />
              <div className="flex-1 mx-4 h-6 bg-slate-200/60 rounded-lg" />
            </div>

            <div className="flex" style={{ background: "#f0f3fa", height: 280 }}>
              {/* Sidebar mock */}
              <div className="w-48 p-4 space-y-1" style={{ background: "linear-gradient(175deg,#080d1a,#111827)" }}>
                <div className="flex items-center gap-2 mb-5 px-2">
                  <div className="w-7 h-7 rounded-lg" style={{ background: "linear-gradient(135deg,#818cf8,#5b5ef4)" }} />
                  <div className="h-3 w-16 bg-white/20 rounded" />
                </div>
                {["Dashboard","Income","Expenses","Profile"].map((item,i) => (
                  <div key={item} className="flex items-center gap-2 h-8 rounded-lg px-2"
                    style={{ background: i === 0 ? "rgba(91,94,244,.25)" : "transparent", borderLeft: i === 0 ? "2px solid #818cf8" : "2px solid transparent" }}>
                    <div className="w-3 h-3 rounded" style={{ background: i === 0 ? "#818cf8" : "#334155" }} />
                    <div className="h-2 rounded flex-1" style={{ background: i === 0 ? "rgba(255,255,255,.3)" : "#1e293b" }} />
                  </div>
                ))}
              </div>

              {/* Content mock */}
              <div className="flex-1 p-5">
                <div className="h-5 w-28 bg-slate-200 rounded mb-4" />
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Balance", val: "₹1,56,150", bg: "rgba(91,94,244,.08)", c: "#5b5ef4" },
                    { label: "Income",  val: "₹1,64,500", bg: "rgba(0,200,150,.08)", c: "#00c896" },
                    { label: "Expense", val: "₹8,350",    bg: "rgba(240,79,94,.08)",  c: "#f04f5e" },
                  ].map(({ label, val, bg, c }) => (
                    <div key={label} className="rounded-xl p-3 border" style={{ background: "white", borderColor: "#e8edf8" }}>
                      <div className="text-[9px] font-bold mb-1" style={{ color: "#94a3b8" }}>{label}</div>
                      <div className="text-sm font-extrabold" style={{ color: c }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "#e8edf8" }}>
                  <div className="flex items-end gap-2 h-20">
                    {[30,60,45,80,55,70,40,65,50,75].map((h,i) => (
                      <div key={i} className="flex-1 rounded-t-md"
                        style={{ height: `${h}%`, background: i % 2 === 0 ? "rgba(91,94,244,.5)" : "rgba(0,200,150,.5)" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Features ── */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Everything you need</h2>
            <p className="text-slate-400 text-sm">Powerful tools to master your finances</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white rounded-2xl p-6 border card-hover cursor-default"
                style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
              >
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-indigo-600" />
                </div>
                <h3 className="font-extrabold text-slate-800 mb-2 text-sm">{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>

                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-indigo-500">
                  <CheckCircle2 size={11} /> Included in all plans
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t py-6 text-center text-xs text-slate-400 font-medium" style={{ borderColor: "var(--border)" }}>
        © {new Date().getFullYear()} FinTrack — Built for smart money management
      </footer>
    </div>
  );
}