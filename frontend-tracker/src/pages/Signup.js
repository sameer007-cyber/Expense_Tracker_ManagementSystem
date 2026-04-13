import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { TrendingUp, Sparkles, ShieldCheck, BarChart2, User, Mail, Lock, ArrowRight } from "lucide-react";

const features = [
  { icon: Sparkles,    title: "AI-Powered Insights",   desc: "Personalised tips that adapt to your spending habits daily." },
  { icon: ShieldCheck, title: "Bank-Grade Security",    desc: "256-bit encryption keeps your data safe at all times." },
  { icon: BarChart2,   title: "Smart Budget Tools",     desc: "Set goals, track progress, and stay on top of every rupee." },
];

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm]       = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await API.post("/auth/signup", form);
      nav("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally { setLoading(false); }
  };

  const field = (Icon, type, placeholder, key) => (
    <div className="relative">
      <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input required type={type} placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none transition-all"
        style={{ background: "#f8fafc", borderColor: "var(--border)", color: "var(--text-1)" }}
        onFocus={e => e.target.style.borderColor = "#5b5ef4"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
        onChange={e => setForm({ ...form, [key]: e.target.value })} />
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="hidden md:flex w-1/2 flex-col justify-center p-14 relative overflow-hidden"
        style={{ background: "linear-gradient(150deg,#080d1a 0%,#1e1b4b 60%,#1e293b 100%)" }}>
        {[200,320,440].map((s,i) => (
          <div key={i} className="absolute rounded-full border border-white/[.05] pointer-events-none"
            style={{ width: s, height: s, right: -s/2.5, top: "50%", transform: "translateY(-50%)" }} />
        ))}

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(91,94,244,.25)", border: "1px solid rgba(91,94,244,.3)" }}>
              <TrendingUp size={20} className="text-indigo-400" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">FinTrack</span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight mb-3 text-white">
            Take control of your<br />
            <span style={{ color: "#818cf8" }}>financial future</span>
          </h2>
          <p className="text-slate-400 text-sm mb-3 leading-relaxed">
            Join <span className="font-bold text-white">50,000+</span> users who manage smarter with real-time insights.
          </p>

          <ul className="space-y-5 mt-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(91,94,244,.2)", border: "1px solid rgba(91,94,244,.3)" }}>
                  <Icon size={15} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white mb-0.5">{title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6" style={{ background: "var(--bg)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [.22,1,.36,1] }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-2xl border p-8" style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-md)" }}>
            <div className="flex items-center gap-2 mb-7 md:hidden">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#818cf8,#5b5ef4)" }}>
                <TrendingUp size={14} className="text-white" />
              </div>
              <span className="font-extrabold text-slate-800">FinTrack</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Create account</h2>
            <p className="text-slate-400 text-sm mb-7">Start your financial journey today</p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-3">
              {field(User,  "text",     "Full name",      "username")}
              {field(Mail,  "email",    "Email address",  "email")}
              {field(Lock,  "password", "Password",       "password")}

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="w-full py-3 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 mt-1 disabled:opacity-60"
                style={{ background: "linear-gradient(90deg,#5b5ef4,#4f46e5)", boxShadow: "0 4px 16px rgba(91,94,244,.3)" }}
              >
                {loading ? "Creating account…" : <><span>Create Account</span><ArrowRight size={14} /></>}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold hover:underline" style={{ color: "#5b5ef4" }}>
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}