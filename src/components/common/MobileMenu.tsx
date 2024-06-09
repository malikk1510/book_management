// src/components/MobileMenu.tsx
import React from "react";
import NavLink from "./NavLink";
import { useLocation } from "react-router-dom";

interface MobileMenuProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
  closeMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isLoggedIn, handleLogout, closeMenu }) => {
  const location = useLocation();
  return (
    <nav className="md:hidden bg-blue-600 text-white">
      <ul className="flex flex-col space-y-3 py-4 px-6">
        {isLoggedIn ? (
          <>
            <li 
            className={`rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300 ${
              location.pathname === "/books" ? "bg-red-300 text-white" : ""
            }`}>
              <NavLink to="/books" onClick={closeMenu}>Books</NavLink>
            </li>
            <li  className={`rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300 ${
                  location.pathname === "/reading-list"
                    ? "bg-red-300 text-white"
                    : ""
                }`}>
              <NavLink to="/reading-list" onClick={closeMenu}>Reading List</NavLink>
            </li>
            <li className="rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300">
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            {location.pathname === "/login" && (
              <li className="rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300">
                <NavLink to="/signup" onClick={closeMenu}>Signup</NavLink>
              </li>
            )}
            {location.pathname === "/signup" && (
              <li className="rounded cursor-pointer hover:bg-red-300 px-3 py-2 hover:text-white-600 transition duration-300">
                <NavLink to="/" onClick={closeMenu}>Login</NavLink>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default MobileMenu;
