import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI, RegisterErrorResponse, RegisterSuccessResponse, LoginResponse } from "../../services/auth/auth-services";
import { isErrorResponse } from "../../../utils/errorHander";

// Define the structure of the state
interface AuthState {
  loggedIn: boolean;
  userInfo: any; // Modify the type as per your actual user info structure
  access_token: string;
}

// Define the types for the response data
const initialState: AuthState = {
  loggedIn: false,
  userInfo: null,
  access_token: "",
};

export const loginUserThunk = createAsyncThunk(
  "/loginUser",
   async (payload: {  email: string; password: string }, { rejectWithValue }) => {
    const response = await authAPI.loginUserApi(payload);
    if (isErrorResponse(response) && response.error.statusCode !== 200) {
      return rejectWithValue(response as RegisterErrorResponse);
    }
    return response as LoginResponse;
  }
);

export const registerUserThunk = createAsyncThunk(
  '/registerUser',
  async (payload: { name: string; email: string; password: string }, { rejectWithValue }) => {
    const response = await authAPI.registerUserApi(payload);
    if (isErrorResponse(response) && response.error.statusCode !== 200) {
      return rejectWithValue(response as RegisterErrorResponse);
    }
    return response as RegisterSuccessResponse;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.loggedIn = false;
      state.userInfo = null;
      state.access_token = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.userInfo = [];
        state.loggedIn = true;
        state.access_token = action.payload.token;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
