const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export async function fetchExpenses() {
  const resp = await fetch(`${API_BASE}/expenses`);
  return resp.json();
}

export async function createExpense(payload) {
  const resp = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

export async function updateExpense(id, payload) {
  const resp = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw await resp.json();
  return resp.json();
}

export async function deleteExpense(id) {
  const resp = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'DELETE'
  });
  if (resp.status === 204) return true;
  throw await resp.json();
}
