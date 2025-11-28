import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username:'', email:'', password:'' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', form);
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input required 
          placeholder="Username" 
          className="p-2 border" 
          onChange={e=>setForm({...form,username:e.target.value})} 
          />

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
          
          <button className="bg-purple-600 text-white p-2 rounded">Signup</button>
        </form>
        <p className="mt-3">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
}
