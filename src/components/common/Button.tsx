import React from "react";
import Loader from "./Loader";

interface ButtonProps {
  text: string;
  loading: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, loading }) => {
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center"
      disabled={loading}
    >
      {loading ? <Loader /> : text}
    </button>
  );
};

export default Button;
