import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, User, IndianRupee, Wallet,
  LogOut, Sparkles, TrendingUp, PieChart,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/income",    label: "Income",    icon: IndianRupee },
  { to: "/expenses",  label: "Expenses",  icon: Wallet },
  { to: "/profile",   label: "Profile",   icon: User },
  { to: "/upgrade",   label: "Upgrade",   icon: Sparkles },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  const initials = (user.username || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);

  return (
    <aside
      className="w-64 min-h-screen flex flex-col justify-between sticky top-0 h-screen overflow-hidden"
      style={{ background: "linear-gradient(175deg,#080d1a 0%,#0e1525 50%,#111827 100%)" }}
    >
      {/* Top noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      <div className="relative p-6 flex flex-col h-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-8"
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{ background: "linear-gradient(135deg,#818cf8,#5b5ef4)", boxShadow: "0 0 20px rgba(91,94,244,.4)" }}
          >
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <div className="font-extrabold text-white tracking-tight text-[15px] leading-tight">FinTrack</div>
            <div className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Smart Finance</div>
          </div>
        </motion.div>

        {/* Divider label */}
        <div className="text-[9px] font-bold text-slate-600 tracking-[.15em] uppercase px-3 mb-2">Navigation</div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map(({ to, label, icon: Icon, end }, idx) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-pill"
                      className="absolute inset-0 rounded-xl nav-active-glow"
                      style={{
                        background: "linear-gradient(90deg,rgba(91,94,244,.22) 0%,rgba(91,94,244,.05) 100%)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 36 }}
                    />
                  )}
                  <Icon
                    size={16}
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-300"
                    }`}
                  />
                  <span className="relative z-10">{label}</span>
                  {isActive && (
                    <span className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom user card */}
        <div className="mt-4">
          <div className="h-px mb-4" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)" }} />

          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[.04] border border-white/[.06] mb-2">
            <div
              className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#818cf8,#5b5ef4)" }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-200 truncate">{user.username || "User"}</div>
              <div className="text-[10px] text-slate-500 truncate">{user.email || ""}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}