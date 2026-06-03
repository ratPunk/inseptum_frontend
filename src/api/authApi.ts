import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear if explicitly a 401 and not a login/register request
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    return Promise.reject(error);
  }
);

/* ─── Types ─── */
export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: number;
  name: string;
  login: string;
  email?: string;
  role: UserRole;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  login: string;
  password: string;
}

/* ─── Endpoints ─── */
export const authApi = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  me: () =>
    api.get<{ user: AuthUser }>('/auth/me').then((r) => r.data.user),

  logout: () =>
    api.post<{ message: string }>('/auth/logout').then((r) => r.data),
};

export default api;
