// src/pages/SignUp.jsx
import React, { useState } from "react";
import { AuthService } from "../services/auth";

const SignUp = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match!");
    setLoading(true);
    try {
      const { idToken, user } = await AuthService.signUp({ name, email, password });
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
        <h1 className="text-3xl font-bold text-gray-900 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-md font-semibold ${loading ? "opacity-50" : ""}`}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-500">
          Already have an account? <a href="/signin" className="text-blue-600">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
