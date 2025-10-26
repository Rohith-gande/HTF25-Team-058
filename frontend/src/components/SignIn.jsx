// src/pages/SignIn.jsx
import React, { useState } from "react";
import { AuthService } from "../services/auth";

const SignIn = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { idToken, user } = await AuthService.signIn({ email, password });
      onLogin({ idToken, user });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-md font-semibold ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-500">
          Don't have an account? <a href="/signup" className="text-blue-600">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
