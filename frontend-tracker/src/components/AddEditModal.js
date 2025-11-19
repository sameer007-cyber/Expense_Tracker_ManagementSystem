import React, { useState, useEffect } from 'react';

export default function AddEditModal({ initial, onSave, onClose, defaultType='expense' }) {
  const [form, setForm] = useState({ title:'', amount:'', date:'', category:'', type: defaultType });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        amount: initial.amount || '',
        date: initial.date ? new Date(initial.date).toISOString().slice(0,10) : '',
        category: initial.category || '',
        type: initial.type || defaultType
      });
    }
  }, [initial, defaultType]);

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, amount: Number(form.amount), date: new Date(form.date) });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={submit} className="bg-white p-6 rounded w-96">
        <h3 className="font-semibold mb-4">{initial ? 'Edit' : 'Add'} Entry</h3>
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required placeholder="Title" className="w-full p-2 border rounded mb-2" />
        <input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required type="number" placeholder="Amount" className="w-full p-2 border rounded mb-2" />
        <input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required type="date" className="w-full p-2 border rounded mb-2" />
        <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category" className="w-full p-2 border rounded mb-2" />
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full p-2 border rounded mb-4">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded border">Cancel</button>
          <button type="submit" className="px-3 py-1 rounded bg-purple-600 text-white">Save</button>
        </div>
      </form>
    </div>
  );
}
