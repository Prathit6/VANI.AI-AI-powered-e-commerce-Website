import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/authApi";

// Async thunk for admin login
export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    console.log(info);
    try {
      const { data } = await api.post("/admin-login", info, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      
      // Store token in localStorage
      localStorage.setItem('accessToken', data.token);
      console.log("Response from backend:", data);
      
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response?.data);
      return rejectWithValue(error.response?.data || { error: "Network error" });
    }
  }
);

// Async thunk to get user info
export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-user", {
        withCredentials: true,
      });
      console.log("User info:", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error getting user:", error.response?.data);
      return rejectWithValue(error.response?.data || { error: "Failed to get user" });
    }
  }
);

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: null,
    role: "",
    token: "",
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin login
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(admin_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.token = payload.token;
        state.successMessage = payload.message || "Login successful";
      })
      .addCase(admin_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Something went wrong";
      })
      
      // Get user info
      .addCase(get_user_info.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_user_info.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
        state.role = payload.userInfo?.role || "";
      })
      .addCase(get_user_info.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Failed to get user info";
      });
  },
});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;