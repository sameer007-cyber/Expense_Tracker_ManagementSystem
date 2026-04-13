import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import {
  Camera, Upload, User, Mail, CalendarDays, BadgeCheck,
  KeyRound, LogOut, ShieldCheck, TrendingUp, TrendingDown, Wallet,
  Edit3, CheckCircle2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.38, ease: [.22,1,.36,1] },
  }),
};

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(user?.avatar?.url || "");
  const [loading, setLoading] = useState(false);
  const [stats, setStats]     = useState({ income: 0, expense: 0, balance: 0, txCount: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/expenses/summary");
        const { totalIncome, totalExpense, remaining } = res.data;
        const expR = await API.get("/expenses?type=expense");
        const incR = await API.get("/expenses?type=income");
        setStats({
          income:  totalIncome,
          expense: totalExpense,
          balance: remaining,
          txCount: (expR.data.expenses?.length || 0) + (incR.data.expenses?.length || 0),
        });
      } catch {}
    })();
  }, []);

  if (!user) return null;

  const initials = user.username.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);

  const uploadAvatar = async () => {
    if (!file) return alert("Please select an image");
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setLoading(true);
      const res = await API.put("/users/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const updated = { ...user, avatar: res.data.avatar };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      alert("Profile photo updated!");
    } catch { alert("Upload failed"); }
    finally { setLoading(false); }
  };

  const statsRow = [
    { label: "Balance",      value: `₹${stats.balance.toLocaleString()}`,  icon: Wallet,       color: "#5b5ef4" },
    { label: "Income",       value: `₹${stats.income.toLocaleString()}`,   icon: TrendingUp,   color: "#00c896" },
    { label: "Expenses",     value: `₹${stats.expense.toLocaleString()}`,  icon: TrendingDown, color: "#f04f5e" },
    { label: "Transactions", value: stats.txCount,                          icon: CheckCircle2, color: "#f59e0b" },
  ];

  const infoItems = [
    { label: "Username",      value: user.username,                          icon: User },
    { label: "Email",         value: user.email,                             icon: Mail },
    { label: "Member since",  value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }), icon: CalendarDays },
    { label: "Account type",  value: "Standard",                             icon: BadgeCheck },
  ];

  return (
    <div className="flex" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* ── Hero banner ── */}
        <div
          className="relative h-44 overflow-hidden"
          style={{ background: "linear-gradient(130deg,#0a0e1a 0%,#1e1b4b 55%,#312e81 100%)" }}
        >
          {/* decorative rings */}
          {[160,260,360].map((s,i) => (
            <div key={i} className="absolute rounded-full border border-white/[.06]"
              style={{ width: s, height: s, top: "50%", left: "12%", transform: "translate(-50%,-50%)" }} />
          ))}
          <div className="absolute inset-0 p-8 flex items-end">
            <div className="text-white/50 text-xs font-semibold uppercase tracking-widest">Account Profile</div>
          </div>
        </div>

        <div className="px-8 pb-10">
          {/* ── Avatar row ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="relative group">
                {preview ? (
                  <img src={preview} alt="avatar"
                    className="w-24 h-24 rounded-2xl object-cover border-4 shadow-xl"
                    style={{ borderColor: "var(--bg)" }} />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 shadow-xl flex items-center justify-center text-3xl font-extrabold text-white"
                    style={{ background: "linear-gradient(135deg,#818cf8,#5b5ef4)", borderColor: "var(--bg)" }}>
                    {initials}
                  </div>
                )}
                <label className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      const img = e.target.files[0];
                      if (!img) return;
                      setFile(img);
                      setPreview(URL.createObjectURL(img));
                    }} />
                </label>
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-extrabold text-slate-800">{user.username}</h2>
                <p className="text-sm text-slate-400">{user.email}</p>
                {file && (
                  <p className="text-xs text-indigo-500 font-semibold mt-1">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            {/* Upload btn */}
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={uploadAvatar} disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md disabled:opacity-60"
              style={{ background: "linear-gradient(90deg,#5b5ef4,#4f46e5)", boxShadow: "0 4px 16px rgba(91,94,244,.3)" }}
            >
              <Upload size={13} />
              {loading ? "Uploading…" : "Update Photo"}
            </motion.button>
          </div>

          {/* ── Stats row ── */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"
          >
            {statsRow.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border text-center card-hover cursor-default"
                style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
                <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-3)" }}>{label}</p>
                <p className="text-base font-extrabold num" style={{ color: "var(--text-1)" }}>{value}</p>
              </div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* ── Account Info ── */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="bg-white rounded-2xl border p-6"
              style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <User size={14} className="text-indigo-400" />
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Account Info</h3>
              </div>
              <div className="space-y-2">
                {infoItems.map(({ label, value, icon: Icon }) => (
                  <div key={label}
                    className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-indigo-50 transition-colors cursor-default group">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors shrink-0">
                      <Icon size={13} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                      <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Security ── */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="bg-white rounded-2xl border p-6"
              style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck size={14} className="text-indigo-400" />
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Security</h3>
              </div>

              {/* Security status */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 mb-4">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-700">Account Secured</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Your account is protected with secure authentication.</p>
                </div>
              </div>

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white shadow-md"
                  style={{ background: "linear-gradient(90deg,#5b5ef4,#4f46e5)", boxShadow: "0 4px 16px rgba(91,94,244,.25)" }}
                >
                  <KeyRound size={14} /> Change Password
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-base"
                  style={{ color: "#f04f5e", borderColor: "#fecdd3", background: "#fff1f2" }}
                >
                  <LogOut size={14} /> Sign Out
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}