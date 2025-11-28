import React, { useEffect, useState } from "react";

export default function AddEditModal({ visible, initial = null, onClose, onSave, defaultType = "expense" }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    type: defaultType,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        amount: initial.amount || "",
        category: initial.category || "",
        date: initial.date ? new Date(initial.date).toISOString().slice(0,10) : "",
        type: initial.type || defaultType,
      });
    } else {
      setForm({
        title: "",
        amount: "",
        category: "",
        date: "",
        type: defaultType,
      });
    }
  }, [initial, defaultType]);

  if (!visible) return null;

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      amount: Number(form.amount),
      date: form.date,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={submit} className="bg-white p-6 w-full max-w-md rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{initial ? "Edit" : "Add"} {form.type}</h3>
          <button type="button" onClick={onClose} className="text-gray-600">Close</button>
        </div>

        <div className="space-y-3">
          <input required placeholder="Title" 
          value={form.title} 
          onChange={e=>setForm({...form,title:e.target.value})} 
          className="w-full border p-2 rounded" />

          <input required type="number" placeholder="Amount" 
          value={form.amount} 
          onChange={e=>setForm({...form,amount:e.target.value})} 
          className="w-full border p-2 rounded" />

          <input required type="date" 
          value={form.date} 
          onChange={e=>setForm({...form,date:e.target.value})} 
          className="w-full border p-2 rounded" />

          <input required placeholder="Category" 
          value={form.category} 
          onChange={e=>setForm({...form,category:e.target.value})} 
          className="w-full border p-2 rounded" />

          <select value={form.type} 
          onChange={e=>setForm({...form,type:e.target.value})} 
          className="w-full border p-2 rounded">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" className="px-3 py-1 bg-purple-600 text-white rounded">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
}
