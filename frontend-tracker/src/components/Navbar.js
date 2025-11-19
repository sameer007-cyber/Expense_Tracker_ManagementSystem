import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar({ title }) {
  const { user } = useContext(AuthContext);
  return (
    <header className="bg-white p-4 flex justify-between items-center border-b">
      <div className="text-lg font-semibold">{title || 'Expense Tracker'}</div>
      <div className="text-sm text-gray-600">{user ? user.username : 'Guest'}</div>
    </header>
  );
}
