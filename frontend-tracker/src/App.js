import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import * as api from './api';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.fetchExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(payload) {
    try {
      const newExp = await api.createExpense(payload);
      setExpenses(prev => [newExp, ...prev]);
      setMessage('Expense added.');
      setTimeout(()=>setMessage(''), 2000);
    } catch (err) {
      setMessage(err?.error || 'Create failed');
    }
  }

  async function handleUpdate(payload) {
    try {
      const updated = await api.updateExpense(editing.id, payload);
      setExpenses(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditing(null);
      setMessage('Expense updated.');
      setTimeout(()=>setMessage(''), 2000);
    } catch (err) {
      setMessage(err?.error || 'Update failed');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      setMessage('Deleted.');
      setTimeout(()=>setMessage(''), 1500);
    } catch (err) {
      setMessage(err?.error || 'Delete failed');
    }
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <section id="add" className="panel">
          <ExpenseForm onSubmit={editing ? handleUpdate : handleCreate}
                       initial={editing}
                       submitLabel={editing ? 'Update Expense' : 'Add Expense'} />
          {editing && <button className="link" onClick={() => setEditing(null)}>Cancel edit</button>}
        </section>

        <section id="list" className="panel">
          <h2>Expenses</h2>
          {message && <div className="info">{message}</div>}
          {loading ? <div>Loading...</div> : (
            <ExpenseList expenses={expenses} onEdit={(e) => setEditing(e)} onDelete={handleDelete} />
          )}
        </section>
      </main>
    </>
  );
}
