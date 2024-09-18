"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Use Next.js router

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter(); // Initialize Next.js router

  const login = async () => {
    const user = { email, password };

    try {
      setLoading(true);
      const response = await axios.post("/api/user/login", user); // Next.js API route
      const result = response.data;
      setLoading(false);

      localStorage.setItem("currentUser", JSON.stringify(result));
      setEmail("");
      setPassword("");

      router.push("/"); // Navigate to the home page after login
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="bg-gray-100 p-8 h-screen">
      <div className="max-w-[50%]  mx-auto bg-white p-8 rounded-lg">
        {loading && <p className="text-center text-red-500">Loading...</p>}
        {error && <p className="text-center text-red-500">Login failed...</p>}

        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="p-2 border-b-2 border-gray-300 focus:outline-none focus:border-[#a08448]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="p-2 border-b-2 border-gray-300 focus:outline-none focus:border-[#a08448]"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={login}
          className="w-full bg-[#a08448] text-white py-2 px-4 rounded hover:bg-[#8b6d40]"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
