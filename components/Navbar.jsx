"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/login");
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a className="text-2xl font-bold text-indigo-500" href="/">
                HOTEL DELUNA
              </a>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <ul className="flex items-center space-x-4">
                  {user ? (
                    <div className="relative">
                      <button
                        className="text-lg font-medium text-indigo-500 hover:text-indigo-600 flex items-center"
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
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                          <a
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            href="/profile"
                          >
                            Profile
                          </a>
                          <a
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
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
                          className="text-lg font-medium text-indigo-600 hover:text-indigo-700"
                          href="/register"
                        >
                          Register
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="text-lg font-medium text-indigo-600 hover:text-indigo-700"
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
                  className="bg-indigo-600 p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none"
                  onClick={toggleMobileMenu}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <ul className="flex flex-col p-4 bg-white shadow-lg">
              {user ? (
                <>
                  <li className="text-gray-700">
                    <a href="/profile" className="block px-4 py-2">
                      Profile
                    </a>
                  </li>
                  <li className="text-gray-700">
                    <a
                      onClick={logout}
                      className="block px-4 py-2 cursor-pointer"
                    >
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="text-gray-700">
                    <a className="block px-4 py-2" href="/register">
                      Register
                    </a>
                  </li>
                  <li className="text-gray-700">
                    <a className="block px-4 py-2" href="/login">
                      Login
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
