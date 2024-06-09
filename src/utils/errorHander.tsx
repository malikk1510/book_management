// src/utils/errorHandler.ts

import axios from 'axios';
import { RegisterErrorResponse } from '../redux/services/auth/auth-services';
export const isErrorResponse = (response: any): response is RegisterErrorResponse => {
    return response && response.error && typeof response.error.statusCode === 'number';
  };
export const handleApiError = (error: unknown): RegisterErrorResponse => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data as RegisterErrorResponse;
  } else {
    return {
      status: 'fail',
      error: {
        statusCode: 500,
        status: 'error',
        isOperational: false,
      },
      message: 'An unexpected error occurred',
    } as RegisterErrorResponse;
  }
};
