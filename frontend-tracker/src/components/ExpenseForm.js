import React, { useState, useEffect } from 'react';

export default function ExpenseForm({ onSubmit, initial = null, submitLabel = 'Add Expense' }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setAmount(initial.amount ?? '');
      setDate(initial.date || '');
      setCategory(initial.category || '');
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!title.trim()) return setError('Title required');
    if (isNaN(Number(amount)) || amount === '') return setError('Valid amount required');
    if (!date) return setError('Date required');
    if (!category.trim()) return setError('Category required');
    setError('');
    onSubmit({ title: title.trim(), amount: Number(amount), date, category: category.trim() });
    // reset only if adding new
    if (!initial) {
      setTitle(''); setAmount(''); setDate(''); setCategory('');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>{submitLabel}</h3>
      {error && <div className="error">{error}</div>}
      <label>Title
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </label>
      <label>Amount
        <input value={amount} onChange={e => setAmount(e.target.value)} />
      </label>
      <label>Date
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </label>
      <label>Category
        <input value={category} onChange={e => setCategory(e.target.value)} />
      </label>
      <button type="submit" className="btn">{submitLabel}</button>
    </form>
  );
}
