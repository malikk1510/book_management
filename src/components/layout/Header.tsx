// src/components/Header.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaBook } from "react-icons/fa";

import MobileMenu from "../common/MobileMenu";
import "tailwindcss/tailwind.css";
import NavLink from "../common/NavLink";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";

import { useLocation } from "react-router-dom";

import { logout } from "../../redux/reducers/auth/auth-reducer";
import { removeBookState } from "../../redux/reducers/books/books-reducer";

const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { loggedIn } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeBookState());
    navigate("/");
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold flex items-center"
        >
          <FaBook className="h-8 mr-2" /> {/* Using the FaBook icon directly */}
          Book App
        </NavLink>
        <nav className="hidden md:flex space-x-2">
          {loggedIn ? (
            <>
              <NavLink
                className={`rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300 ${
                  location.pathname === "/books" ? "bg-red-300 text-white" : ""
                }`}
                to="/books"
              >
                Books
              </NavLink>
              <NavLink
                className={`rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300 ${
                  location.pathname === "/reading-list"
                    ? "bg-red-300 text-white"
                    : ""
                }`}
                to="/reading-list"
              >
                Reading List
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname === "/login" && (
                <li className="rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300">
                  <NavLink to="/signup" onClick={closeMenu}>
                    Signup
                  </NavLink>
                </li>
              )}
              {location.pathname === "/signup" && (
                <li className="rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300">
                  <NavLink to="/" onClick={closeMenu}>
                    Login
                  </NavLink>
                </li>
              )}
            </>
          )}
        </nav>
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <MobileMenu
          isLoggedIn={loggedIn}
          handleLogout={handleLogout}
          closeMenu={closeMenu}
        />
      )}
    </header>
  );
};

export default Header;
