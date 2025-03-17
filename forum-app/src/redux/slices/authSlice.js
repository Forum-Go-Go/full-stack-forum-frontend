import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,  // Stores the role (e.g., "admin", "user")
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;  // Store the role
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
