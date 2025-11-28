import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white p-6 border-r min-h-screen">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">ET</div>
        <div>
          <div className="font-semibold">Expense Tracker</div>
          <div className="text-sm text-gray-500">Manage your money</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink to="/" end 
        className={({isActive}) => 
        isActive ? 'p-2 rounded bg-purple-600 text-white' : 'p-2 rounded hover:bg-gray-100'}>
          Dashboard
        </NavLink>
        <NavLink to="/income" 
        className={({isActive}) => isActive ? 'p-2 rounded bg-purple-600 text-white' : 'p-2 rounded hover:bg-gray-100'}>
          Income
        </NavLink>
        <NavLink to="/expenses" 
        className={({isActive}) => isActive ? 'p-2 rounded bg-purple-600 text-white' : 'p-2 rounded hover:bg-gray-100'}>
          Expenses
        </NavLink>
        <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }} className="mt-4 text-left p-2 rounded hover:bg-gray-100">Logout</button>
      </nav>
    </aside>
  );
}
