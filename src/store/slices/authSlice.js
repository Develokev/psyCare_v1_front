import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  userRole: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userRole = action.payload.role;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userRole = null;
      localStorage.removeItem("token");
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { loginSuccess, logout, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;
