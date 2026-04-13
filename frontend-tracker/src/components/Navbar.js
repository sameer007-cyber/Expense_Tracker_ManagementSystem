import React from "react";
import { motion } from "framer-motion";
import { Bell, Search, SunMedium } from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Navbar({ title }) {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
  })();

  return (
    <motion.div
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex justify-between items-center mb-8"
    >
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <SunMedium size={14} className="text-amber-400" />
          <span className="text-xs font-semibold text-slate-400">
            {getGreeting()}{user.username ? `, ${user.username.split(" ")[0]}` : ""}
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "var(--text-1)" }}>
          {title}
        </h1>
        <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-3)" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-9 px-3 flex items-center gap-2 rounded-xl border text-xs font-medium transition-base"
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-3)" }}
        >
          <Search size={14} />
          <span className="hidden sm:inline text-slate-400">Search…</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 font-mono">⌘K</kbd>
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-9 h-9 rounded-xl border flex items-center justify-center transition-base"
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-3)" }}
        >
          <Bell size={15} />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: "var(--primary)", borderColor: "var(--card)" }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}