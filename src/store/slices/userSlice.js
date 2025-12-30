import { createSlice } from "@reduxjs/toolkit";

// Restaurar userData desde localStorage si existe
const storedUserData = localStorage.getItem("userData");
const initialState = {
  userData: storedUserData ? JSON.parse(storedUserData) : null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;
      state.error = null;
      // Persistir en localStorage
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    clearUserData: (state) => {
      state.userData = null;
      // Limpiar localStorage
      localStorage.removeItem("userData");
    },
    setUserError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserData, clearUserData, setUserError, setUserLoading } =
  userSlice.actions;
export default userSlice.reducer;
