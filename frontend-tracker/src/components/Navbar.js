import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Navbar: shows page title on left and user avatar + name on right.
 * Drop-in replacement for your existing Navbar.
 */
export default function Navbar({ title }) {
  const { user } = useContext(AuthContext);

  const initials = user?.username
    ? user.username.split(" ").map(s => s.charAt(0)).slice(0,2).join("").toUpperCase()
    : "U";

  return (
    <header className="bg-white p-4 flex justify-between items-center border-b">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">{title || "Expense Tracker"}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* small optional status / search area could go here */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold shadow">
            {initials}
          </div>
          <div className="text-sm text-gray-700 font-medium">
            {user?.username || "User"}
          </div>
        </div>
      </div>
    </header>
  );
}
