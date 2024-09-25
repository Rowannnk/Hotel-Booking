"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const register = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = { name, email, password };

    try {
      setLoading(true);
      const response = await axios.post("/api/user/register", user);
      console.log(response.data);
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
      setLoading(false);
      setError(error.response?.data?.message || "An error occurred");
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
          Register
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {[
            {
              label: "Name",
              value: name,
              setter: setName,
              placeholder: "Enter your name",
            },
            {
              label: "Email",
              value: email,
              setter: setEmail,
              placeholder: "Enter your email",
            },
            {
              label: "Password",
              value: password,
              setter: setPassword,
              placeholder: "Enter your password",
              type: "password",
            },
            {
              label: "Confirm Password",
              value: confirmPassword,
              setter: setConfirmPassword,
              placeholder: "Confirm your password",
              type: "password",
            },
          ].map(
            ({ label, value, setter, placeholder, type = "text" }, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-lg font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                />
              </div>
            )
          )}
        </div>

        <button
          onClick={register}
          className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
