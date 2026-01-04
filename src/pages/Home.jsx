import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold text-green-400 mb-4">
        Welcome to AMusiqVerse 🎧
      </h1>
      <p className="text-gray-400 max-w-xl mb-8">
        Stream music, podcasts, create playlists, and enjoy your favorite tunes anytime.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-green-500 rounded font-semibold text-white hover:bg-green-600 hover:text-black"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 border border-green-500 text-green-400 rounded font-semibold hover:bg-green-500 hover:text-black"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}