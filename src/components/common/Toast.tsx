// src/utils/toast.ts

import { toast, ToastOptions, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the type for the message parameter
type ToastMessage = string;

const defaultOptions: ToastOptions = {
    position: "top-right" as ToastPosition, // Use string literals for positions
  };
  

export const showSuccessToast = (message: ToastMessage): void => {
  toast.success(message, defaultOptions);
};

export const showErrorToast = (message: ToastMessage): void => {
  toast.error(message, defaultOptions);
};
