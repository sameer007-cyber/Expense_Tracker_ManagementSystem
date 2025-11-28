import React, { useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      nav('/'); // dashboard 
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input required 
          type="email" placeholder="Email" 
          className="p-2 border" 
          onChange={e=>setForm({...form,email:e.target.value})} 
          />

          <input required 
          type="password" placeholder="Password" 
          className="p-2 border" 
          onChange={e=>setForm({...form,password:e.target.value})} 
          />
          <button className="bg-purple-600 text-white p-2 rounded">Login</button>
        </form>
        <p className="mt-3">Don't have an account? <Link to="/signup" className="text-blue-600">Signup</Link></p>
      </div>
    </div>
  );
}
