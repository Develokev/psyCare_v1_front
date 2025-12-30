import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const storedUserData = localStorage.getItem("userData");
const userRole = storedUserData ? JSON.parse(storedUserData).role : null;

const initialState = {
  token: token || null,
  isAuthenticated: !!token, // true si hay token
  userRole: userRole,
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
      localStorage.removeItem("userData");
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
