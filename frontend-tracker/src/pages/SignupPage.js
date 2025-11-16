import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:4000/api/auth/signup";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API, {
        username,
        email,
        password
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="panel">
      <form className="form" onSubmit={handleSubmit}>
        <h3>Signup</h3>
        {message && <div className="info">{message}</div>}

        <label>Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button className="btn">Create Account</button>
      </form>
    </div>
  );
}
