// src/components/NavLink.tsx
import React from "react";
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  className?: string; // Add className prop
  onClick?: () => void;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, onClick, className, children }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  );
};

export default NavLink;
