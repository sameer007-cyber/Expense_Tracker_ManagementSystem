import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Type, IndianRupee, Calendar, Tag, LayoutGrid } from "lucide-react";

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all focus:bg-white";

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5">
        <Icon size={11} /> {label}
      </label>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

export default function AddEditModal({ visible, initial = null, onClose, onSave, defaultType = "expense" }) {
  const [form, setForm] = useState({ title: "", amount: "", category: "", date: "", type: defaultType });

  useEffect(() => {
    if (initial) {
      setForm({
        title:    initial.title    || "",
        amount:   initial.amount   || "",
        category: initial.category || "",
        date:     initial.date ? new Date(initial.date).toISOString().slice(0, 10) : "",
        type:     initial.type     || defaultType,
      });
    } else {
      setForm({ title: "", amount: "", category: "", date: "", type: defaultType });
    }
  }, [initial, defaultType, visible]);

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, amount: Number(form.amount), date: form.date });
  };

  const isIncome = form.type === "income";
  const accent   = isIncome ? "#00c896" : "#f04f5e";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(8,13,26,0.65)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 440, damping: 34 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div
              className="px-6 py-5 flex justify-between items-center relative overflow-hidden"
              style={{ background: isIncome ? "linear-gradient(120deg,#064e3b,#065f46)" : "linear-gradient(120deg,#1e1b4b,#312e81)" }}
            >
              {/* decorative circle */}
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20"
                style={{ background: accent }} />

              <div className="relative">
                <p className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest mb-1">
                  {initial ? "Edit" : "New"} Entry
                </p>
                <h3 className="text-lg font-extrabold text-white capitalize">{form.type}</h3>
              </div>

              {/* Type toggle */}
              <div className="flex items-center gap-2 relative">
                <div className="flex bg-white/10 rounded-xl p-0.5">
                  {["income","expense"].map(t => (
                    <button key={t} type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className="px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all capitalize"
                      style={{
                        background: form.type === t ? "rgba(255,255,255,.25)" : "transparent",
                        color: form.type === t ? "white" : "rgba(255,255,255,.5)",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* ── Form ── */}
            <form onSubmit={submit} className="p-6 space-y-4">
              <Field label="Title" icon={Type}>
                <input className={inputCls} placeholder="e.g. Netflix subscription"
                  value={form.title} required
                  onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  onChange={e => setForm({ ...form, title: e.target.value })} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount (₹)" icon={IndianRupee}>
                  <input className={inputCls} type="number" placeholder="0.00"
                    value={form.amount} required
                    onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    onChange={e => setForm({ ...form, amount: e.target.value })} />
                </Field>

                <Field label="Date" icon={Calendar}>
                  <input className={inputCls} type="date"
                    value={form.date} required
                    onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    onChange={e => setForm({ ...form, date: e.target.value })} />
                </Field>
              </div>

              <Field label="Category" icon={Tag}>
                <input className={inputCls} placeholder="e.g. Food, Transport, Salary"
                  value={form.category}
                  onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  onChange={e => setForm({ ...form, category: e.target.value })} />
              </Field>

              {/* Actions */}
              <div className="flex gap-2.5 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-base"
                  style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl shadow-md"
                  style={{ background: `linear-gradient(90deg,${accent},${isIncome ? "#059669" : "#e11d48"})`, boxShadow: `0 4px 14px ${accent}40` }}
                >
                  {initial ? "Save Changes" : "Add Entry"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}