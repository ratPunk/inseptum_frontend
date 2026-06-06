import api from './authApi';
import { AuthUser, UserRole } from './authApi';

/* ─── Types ─── */

export interface AdminUser extends AuthUser {
  email?: string;
  articles_count?: number;
}

export interface UsersListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateUserPayload {
  name: string;
  login: string;
  email?: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  login?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

/* ─── Endpoints ─── */

export const usersApi = {
  /** Get all users with filtering and pagination */
  index: (options: {
    search?: string;
    role?: UserRole | '';
    sortBy?: 'name' | 'login' | 'created_at' | 'role';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}) =>
    api
      .get<UsersListResponse>('/admin/users', {
        params: {
          search: options.search,
          role: options.role || undefined,
          sort_by: options.sortBy,
          sort_order: options.sortOrder,
          page: options.page ?? 1,
          limit: options.limit ?? 12,
        },
      })
      .then((r) => r.data),

  /** Get a single user */
  show: (id: number) =>
    api
      .get<{ user: AdminUser }>(`/admin/users/${id}`)
      .then((r) => r.data.user),

  /** Create a new user */
  create: (data: CreateUserPayload) =>
    api
      .post<{ message: string; user: AdminUser }>('/admin/users', data)
      .then((r) => r.data),

  /** Update a user */
  update: (id: number, data: UpdateUserPayload) =>
    api
      .put<{ message: string; user: AdminUser }>(`/admin/users/${id}`, data)
      .then((r) => r.data),

  /** Delete a user */
  delete: (id: number) =>
    api
      .delete<{ message: string }>(`/admin/users/${id}`)
      .then((r) => r.data),

  /** Change user role */
  changeRole: (id: number, role: UserRole) =>
    api
      .patch<{ message: string; user: AdminUser }>(`/admin/users/${id}/role`, { role })
      .then((r) => r.data),
};
