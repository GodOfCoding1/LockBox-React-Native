import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "@/redux/slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
