import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({ title }) {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white p-4 flex justify-between items-center border-b">
      <h2 className="text-xl font-semibold">{title}</h2>

      {/* Right side user section */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg shadow">
          {user?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Username */}
        <span className="font-medium text-gray-700">
          {user?.username}
        </span>
      </div>
    </header>
  );
}
