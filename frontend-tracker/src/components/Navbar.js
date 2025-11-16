import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ token, onLogout }) {
  return (
    <nav className="nav">
      <div className="container">
        <h1 className="brand">Expense Manager</h1>
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/expenses">Expenses</Link>
              <button className="link" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
