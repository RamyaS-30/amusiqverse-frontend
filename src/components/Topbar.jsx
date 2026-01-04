import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      {/* App Name / Logo */}
      <h1
        className="text-green-400 font-bold text-xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        AMusiqVerse 🎧
      </h1>

      {/* Navigation Links + Admin Upload */}
      <div className="flex items-center gap-4">
        

        <span className="relative group text-gray-300 cursor-pointer">
          Hello, <span className="text-green-400 font-semibold">{user?.name || "User"}</span>
          {/* Tooltip */}
          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
            {user?.email}
          </span>
        </span>

        <button
          onClick={logout}
          className="px-4 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
