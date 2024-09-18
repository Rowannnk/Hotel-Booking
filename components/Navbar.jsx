"use client"; // Ensures that this component is rendered on the client side

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/login"); // Use router.push for client-side navigation
  };

  return (
    <div>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a className="text-xl font-semibold text-gray-800" href="/home">
                Hotel Rooms
              </a>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <ul className="flex items-center space-x-4">
                  {user ? (
                    <div className="relative">
                      <button
                        className="text-gray-700 font-medium hover:text-gray-900 flex items-center"
                        id="dropdownMenuButton"
                        onClick={toggleDropdown}
                      >
                        {user.name}
                        <svg
                          className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-90" : "rotate-0"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h14M12 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      {isDropdownOpen && (
                        <div
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            href="/profile"
                          >
                            Profile
                          </a>
                          <a
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            href="#"
                            onClick={logout}
                          >
                            Logout
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <li className="nav-item">
                        <a
                          className="text-gray-700 font-medium hover:text-gray-900"
                          href="/register"
                        >
                          Register
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="text-gray-700 font-medium hover:text-gray-900"
                          href="/login"
                        >
                          Login
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
