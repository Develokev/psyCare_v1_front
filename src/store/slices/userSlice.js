import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
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
    },
    clearUserData: (state) => {
      state.userData = null;
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
