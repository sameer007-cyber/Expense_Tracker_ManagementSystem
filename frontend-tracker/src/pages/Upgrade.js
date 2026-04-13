import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const plans = [
  {
    name: "Starter",
    price: "20",
    icon: Zap,
    tagline: "Perfect for individuals",
    features: [
      "10 users included",
      "2 GB of storage",
      "Email support",
      "Help center access",
    ],
    highlight: false,
    accent: "#64748b",
  },
  {
    name: "Pro",
    price: "30",
    icon: Crown,
    tagline: "Best for growing teams",
    features: [
      "20 users included",
      "5 GB of storage",
      "Priority email support",
      "Help center access",
      "Phone support",
      "Community access",
    ],
    highlight: true,
    accent: "#5b5ef4",
  },
];

export default function Upgrade() {
  return (
    <div className="flex" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <Navbar title="Upgrade" />

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full mb-4">
              <Sparkles size={11} /> Simple, transparent pricing
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Choose your plan</h2>
            <p className="text-slate-400 text-sm">Unlock powerful features to take your finances to the next level.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {plans.map(({ name, price, icon: Icon, tagline, features, highlight, accent }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, ease: [.22,1,.36,1] }}
                whileHover={{ y: -4, boxShadow: highlight ? "0 20px 60px rgba(91,94,244,.2)" : "0 12px 40px rgba(0,0,0,.1)" }}
                className="relative bg-white rounded-2xl border overflow-hidden transition-shadow cursor-default"
                style={{ borderColor: highlight ? accent : "var(--border)", boxShadow: "var(--shadow)" }}
              >
                {/* Top accent bar */}
                {highlight && (
                  <div className="h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg,${accent},#8b5cf6)` }} />
                )}

                <div className="p-7">
                  {/* Plan header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                        style={{ background: highlight ? `linear-gradient(135deg,${accent},#8b5cf6)` : "#f1f5f9", boxShadow: highlight ? `0 4px 16px ${accent}40` : "none" }}>
                        <Icon size={18} className={highlight ? "text-white" : "text-slate-500"} />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-800">{name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{tagline}</div>
                      </div>
                    </div>
                    {highlight && (
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                        style={{ background: `${accent}12`, color: accent, borderColor: `${accent}25` }}>
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold num text-slate-800">${price}</span>
                      <span className="text-slate-400 text-sm">/month</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Billed monthly, cancel anytime</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-7">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: highlight ? `${accent}15` : "#f1f5f9" }}>
                          <Check size={11} style={{ color: highlight ? accent : "#94a3b8" }} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 text-sm font-bold rounded-xl transition-all"
                    style={
                      highlight
                        ? { background: `linear-gradient(90deg,${accent},#4f46e5)`, color: "white", boxShadow: `0 4px 16px ${accent}40` }
                        : { background: "transparent", color: "#5b5ef4", border: `1.5px solid #5b5ef4` }
                    }
                  >
                    Get Started with {name}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Money-back note */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center text-xs text-slate-400 mt-8 font-medium"
          >
            ✦ 30-day money-back guarantee · No hidden fees · Cancel anytime
          </motion.p>
        </div>
      </div>
    </div>
  );
}