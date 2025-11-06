import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import appointmentReducer from "./slices/appointmentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    appointments: appointmentReducer,
  },
});
