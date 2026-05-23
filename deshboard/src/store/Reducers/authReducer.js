// src/store/Reducers/authReducer.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/authApi";

// ───────────────── ADMIN LOGIN ─────────────────
export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/admin-login", info, { withCredentials: true });
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("role", "admin");
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Admin login failed" });
    }
  }
);

// ───────────────── USER REGISTER ─────────────────
export const user_register = createAsyncThunk(
  "auth/user_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/user-register", info, { withCredentials: true });
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("role", "user");
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Registration failed" });
    }
  }
);

// ───────────────── USER LOGIN ─────────────────
export const user_login = createAsyncThunk(
  "auth/user_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/user-login", info, { withCredentials: true });
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("role", "user");
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Login failed" });
    }
  }
);

// ───────────────── SELLER REGISTER ─────────────────
export const seller_register = createAsyncThunk(
  "auth/seller_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/seller-register", info, { withCredentials: true });
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("role", "seller");
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Registration failed" });
    }
  }
);

// ───────────────── SELLER LOGIN ─────────────────
export const seller_login = createAsyncThunk(
  "auth/seller_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/seller-login", info, { withCredentials: true });
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("role", "seller");
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Login failed" });
    }
  }
);

// ───────────────── LOGOUT ─────────────────
export const user_logout = createAsyncThunk(
  "auth/user_logout",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/user-logout", { withCredentials: true });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Logout failed" });
    }
  }
);

// ───────────────── GET USER INFO ─────────────────
export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-user", { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Failed to get user" });
    }
  }
);

// ───────────────── SLICE ─────────────────
export const authReducer = createSlice({
  name: "auth",

  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: null,
    role: localStorage.getItem("role") || "",
    token: localStorage.getItem("accessToken") || "",
  },

  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    // ─── Sync Redux userInfo after profile update ──────────────────────────────
    // Called by ProfileModal after a successful PUT /api/user/profile
    // so Header + avatar update instantly without a page refresh.
    update_user_info: (state, { payload }) => {
      state.userInfo = { ...state.userInfo, ...payload };
    },
  },

  extraReducers: (builder) => {
    builder

      // ── ADMIN LOGIN ──
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(admin_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.token = payload.token;
        state.role = "admin";
        state.userInfo = payload.userInfo || { name: "Admin", role: "admin" };
        state.successMessage = payload.message || "Admin login successful";
      })
      .addCase(admin_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Admin login failed";
      })

      // ── USER REGISTER ──
      .addCase(user_register.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(user_register.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.token = payload.token;
        state.userInfo = payload.userInfo;
        state.role = payload.userInfo?.role || "user";
        state.successMessage = payload.message || "Registration successful";
      })
      .addCase(user_register.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Registration failed";
      })

      // ── USER LOGIN ──
      .addCase(user_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(user_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.token = payload.token;
        state.userInfo = payload.userInfo;
        state.role = payload.userInfo?.role || "user";
        state.successMessage = payload.message || "Login successful";
      })
      .addCase(user_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Login failed";
      })

      // ── SELLER REGISTER ──
      .addCase(seller_register.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(seller_register.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.token = payload.token;
        state.userInfo = payload.userInfo;
        state.role = payload.userInfo?.role || "seller";
        state.successMessage = payload.message || "Registration successful";
      })
      .addCase(seller_register.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Registration failed";
      })

      // ── SELLER LOGIN ──
      .addCase(seller_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(seller_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.token = payload.token;
        state.userInfo = payload.userInfo;
        state.role = payload.userInfo?.role || "seller";
        state.successMessage = payload.message || "Login successful";
      })
      .addCase(seller_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error || "Login failed";
      })

      // ── LOGOUT ──
      .addCase(user_logout.fulfilled, (state) => {
        state.token = "";
        state.userInfo = null;
        state.role = "";
        state.successMessage = "Logged out successfully";
      })

      // ── GET USER INFO ──
      .addCase(get_user_info.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_user_info.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
        state.role = payload.userInfo?.role || "";
      })
      .addCase(get_user_info.rejected, (state) => {
        state.loader = false;
        state.token = "";
        state.userInfo = null;
      });
  },
});

export const { messageClear, update_user_info } = authReducer.actions;
export default authReducer.reducer;
