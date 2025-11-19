import React from 'react';

export default function ExpenseList({ items = [], onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="font-semibold mb-4">Recent Transactions</h3>
      <ul className="space-y-3">
        {items.map(it => (
          <li key={it._id} className="flex justify-between items-center border-b pb-2">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-gray-500">{new Date(it.date).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded ${it.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {it.type === 'income' ? `+ ₹${it.amount}` : `- ₹${it.amount}`}
              </div>
              <button onClick={() => onEdit(it)} className="text-sm text-blue-600">Edit</button>
              <button onClick={() => onDelete(it._id)} className="text-sm text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
