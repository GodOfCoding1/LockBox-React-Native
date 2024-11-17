import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean | null;
}

const initialState: AuthState = {
  isAuthenticated: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToAuthorized: (state) => {
      state.isAuthenticated = true;
    },
    setAuthToUnAuthorized: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthToAuthorized, setAuthToUnAuthorized } = authSlice.actions;

export default authSlice.reducer;
