"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter(); 

  const login = async () => {
    const user = { email, password };

    try {
      setLoading(true);
      const response = await axios.post("/api/user/login", user); 
      const result = response.data;

      // Ensure result contains the user ID
      if (result && result._id) {
        localStorage.setItem("currentUser", JSON.stringify(result));
      } else {
        throw new Error("User ID not found in response");
      }

      setLoading(false);
      setEmail("");
      setPassword("");

      router.push("/"); 
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error("Login error:", error);
    }
  };
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-20 flex items-center justify-center h-screen">
        <Error />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-gradient-to-r from-blue-50 to-purple-100 p-10 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">
          Login
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={login}
          className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
