import axios from "axios";
import { handleApiError } from "../../../utils/errorHander";

export const baseURL = "http://localhost:5000/api/auth/"
export const api = axios.create({
  baseURL,
});

// Define types for the response data
export interface LoginResponse {
  token: string;
}

export interface RegisterSuccessResponse {
  msg: string;
}

export interface RegisterErrorResponse {
  status: string;
  error: {
    statusCode: number;
    status: string;
    isOperational: boolean;
  };
  message: string;
  stack?: string;
}

export const authAPI = {
  loginUserApi: async (payload: { email: string, password: string }): Promise<LoginResponse | RegisterErrorResponse> => {
    try {
      const response = await api.post(
        `${baseURL}login`,
        { ...payload },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error)
    }
  },

  registerUserApi: async (payload: { name: string, email: string, password: string }): Promise<RegisterSuccessResponse | RegisterErrorResponse> => {
    try {
      const response = await api.post(
        `${baseURL}register`,
        { ...payload },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error)
    }
  },
};
