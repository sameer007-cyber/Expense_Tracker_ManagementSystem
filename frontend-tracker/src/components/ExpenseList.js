import React from "react";

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0) return <div className="empty">No expenses yet.</div>;

  return (
    <div className="list">
      {expenses.map((exp) => (
        <div key={exp._id} className="card">
          <div className="card-left">
            <div className="title">{exp.title}</div>
            <div className="meta">
              {exp.category} • {new Date(exp.date).toLocaleDateString()}
            </div>
          </div>
          <div className="card-right">
            <div className="amount">₹{Number(exp.amount).toFixed(2)}</div>
            <div className="actions">
              <button className="small" onClick={() => onEdit(exp)}>Edit</button>
              <button className="small danger" onClick={() => onDelete(exp._id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
