import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { validateEmail, validatePassword } from "../utils/validation";
import "tailwindcss/tailwind.css";

import InputField from "../components/common/InputField";
import Button from "../components/common/Button";

import { AppDispatch} from "../redux/store";
import { loginUserThunk } from "../redux/reducers/auth/auth-reducer"; // Import the thunk action creator
import {RegisterErrorResponse} from "../redux/services/auth/auth-services"

import { showErrorToast, showSuccessToast } from "../components/common/Toast";



const LoginForm: React.FC= () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email) ? "" : "Invalid email format";
    const passwordError = validatePassword(password)
      ? ""
      : "Password must be 6-16 characters long and include at least one digit and one special character";

    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      try {
        const resultAction = await dispatch(loginUserThunk({email,password}));
        if (loginUserThunk.fulfilled.match(resultAction)) {
          showSuccessToast("Loggedin Successfully");
          navigate('/books');
        } else {
          const errorResponse = resultAction.payload as RegisterErrorResponse;
          showErrorToast(errorResponse.message);
        }
      } catch (error) {
        showErrorToast('Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Button text="Login" loading={loading} />
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">Don't have an account?</p>
          <Link
            to="/signup"
            className="text-blue-600 hover:underline transition duration-300"
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
