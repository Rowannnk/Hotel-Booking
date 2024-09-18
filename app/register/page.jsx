"use client"; // Ensures that this component is rendered on the client side

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Update error state to store error details
  const router = useRouter();

  const register = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = { name, email, password }; // Do not include confirmPassword

    try {
      setLoading(true);
      const response = await axios.post("/api/user/register", user);
      console.log(response.data); // Log the response data for debugging
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (error) {
      console.error(error.response?.data || error.message); // Log the error response or message
      setLoading(false);
      setError(error.response?.data?.message || "An error occurred"); // Show specific error message
    }
  };

  return (
    <div className="bg-gray-100 p-8 h-screen">
      <div className="max-w-[50%] mx-auto bg-white p-8 rounded-lg">
        {loading && <p className="text-center text-red-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

        <div className="grid grid-cols-1 gap-4">
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
              <div key={index} className="flex flex-col mb-4">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  className="p-2 border-b-2 border-gray-300 focus:outline-none focus:border-[#a08448]"
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
          className="w-full bg-[#a08448] text-white py-2 px-4 rounded hover:bg-[#8b6d40]"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
