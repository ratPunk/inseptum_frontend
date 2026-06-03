import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Type for user
export interface AuthUser {
  id: number;
  name: string;
  login: string;
  email?: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const storedToken = localStorage.getItem('auth_token');
const storedUser = localStorage.getItem('auth_user');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: !!storedToken && !!storedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
    },
    updateUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      localStorage.setItem('auth_user', JSON.stringify(action.payload));
    },
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
  },
});

export const { setCredentials, updateUser, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
