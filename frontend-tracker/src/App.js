import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ExpensesPage from "./pages/ExpensesPage";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Navbar token={token} onLogout={handleLogout} />

      <main className="container">
        <Routes>
          {!token ? (
            <>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/expenses" element={<ExpensesPage token={token} />} />
              <Route path="*" element={<Navigate to="/expenses" />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
}
