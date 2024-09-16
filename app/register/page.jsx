"use client"; // For Next.js 13 with app directory

import React, { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      alert("Registration successful!");
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="bg-gray-100 p-8 h-screen">
      <div className="max-w-[50%] mx-auto bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
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

          <button
            type="submit"
            className="w-full bg-[#a08448] text-white py-2 px-4 rounded hover:bg-[#8b6d40]"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
