import React from 'react';

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="container">
        <h1 className="brand">Expense Manager</h1>
        <div className="nav-links">
          <a href="#list">Expenses</a>
          <a href="#add">Add</a>
        </div>
      </div>
    </nav>
  );
}
