import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validation";
import "tailwindcss/tailwind.css";
import { AppDispatch, RootState } from "../redux/store";
import InputField from "../components/common/InputField";
import Spinner from "../components/common/Spinner";
import { registerUserThunk } from "../redux/reducers/auth/auth-reducer"; // Import the thunk action creator
import { showErrorToast, showSuccessToast } from "../components/common/Toast";
import Button from "../components/common/Button";
import {RegisterErrorResponse,RegisterSuccessResponse} from "../redux/services/auth/auth-services"

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch(); // Initialize dispatch function

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = (): boolean => {
    const { name, email, password, confirmPassword } = formData;
    const newErrors = {
      name: validateName(name) ? "" : "Please enter alphabetic characters",
      email: validateEmail(email) ? "" : "Invalid email format",
      password: validatePassword(password)
        ? ""
        : "Password must be 6-16 characters long and include at least one digit and one special character",
      confirmPassword:
        password === confirmPassword ? "" : "Passwords do not match",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const resultAction = await dispatch(registerUserThunk(formData));
        if (registerUserThunk.fulfilled.match(resultAction)) {
          const response = resultAction.payload as RegisterSuccessResponse;
          showSuccessToast(response.msg);
          navigate('/');
        } else {
          const errorResponse = resultAction.payload as RegisterErrorResponse;
          showErrorToast(errorResponse.message);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        showErrorToast('Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="name"
            label="Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <div>
            <Button text="Signup" loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
