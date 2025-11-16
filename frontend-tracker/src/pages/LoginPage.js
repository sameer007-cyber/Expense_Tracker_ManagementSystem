import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:4000/api/auth/login";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API, { email, password });
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="panel">
      <form className="form" onSubmit={handleSubmit}>
        <h3>Login</h3>
        {error && <div className="error">{error}</div>}
        <label>Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button className="btn">Login</button>
      </form>
    </div>
  );
}
