import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

export default function ExpenseList({ items = [], onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
      <div className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}>
        <h3 className="font-extrabold text-slate-800">Recent Transactions</h3>
        <span className="text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">
          {items.length} entries
        </span>
      </div>

      <ul>
        <AnimatePresence>
          {items.map((it, i) => {
            const isIncome = it.type === "income";
            const color    = isIncome ? "#00c896" : "#f04f5e";
            return (
              <motion.li
                key={it._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ delay: i * 0.04 }}
                className="flex justify-between items-center px-6 py-3.5 border-b last:border-0 transition-colors group"
                style={{ borderColor: "#fafafa" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0"
                    style={{ background: `${color}18`, color }}>
                    {it.title?.[0]?.toUpperCase() || "?"}
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

                {/* Right */}
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm num" style={{ color }}>
                    {isIncome ? "+" : "−"}₹{it.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(it)}
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
            );
          })}
        </AnimatePresence>

        {items.length === 0 && (
          <li className="px-6 py-14 text-center text-slate-400 text-sm">No transactions yet</li>
        )}
      </ul>
    </div>
  );
}