import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const API_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Registration failed");
        return;
      }

      // ✅ Registration successful
      setSuccess("Account created successfully. Please login.");

      // ✅ Redirect to login after short delay
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);

    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="bg-gray-900 text-white shadow-2xl rounded-2xl w-full max-w-md p-8 sm:p-10">
        <h2 className="text-4xl font-bold text-green-400 mb-6 text-center">
          Create Account
        </h2>

        <p className="text-gray-400 text-center mb-8">
          Start streaming your favorite music & podcasts
        </p>

        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-400 hover:bg-green-500 text-gray-900 font-semibold rounded-lg transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 mt-6 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
