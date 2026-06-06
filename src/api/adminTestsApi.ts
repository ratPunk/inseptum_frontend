/**
 * Admin API-клиент для управления тестами.
 *
 * Эндпоинты:
 *   GET    /api/admin/tests                — список тестов с фильтрацией/пагинацией
 *   GET    /api/admin/tests/:id            — метаданные теста
 *   POST   /api/admin/tests               — создать тест (multipart/form-data)
 *   PUT    /api/admin/tests/:id           — обновить тест (multipart/form-data)
 *   DELETE /api/admin/tests/:id           — удалить тест
 *   GET    /api/admin/tests/:id/download  — скачать JSON-файл теста
 */

import api from '@api/authApi';

export interface AdminTestMeta {
  id: number;
  title: string;
  description: string;
  category: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  max_score: number;
  time_limit: number | null;
  status: 'active' | 'draft' | 'archived';
  filename: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminTestsListResponse {
  tests: AdminTestMeta[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminTestsParams {
  search?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | '';
  status?: 'active' | 'draft' | 'archived' | '';
  sortBy?: 'title' | 'created_at' | 'updated_at' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const adminTestsApi = {
  /** Получить список тестов с фильтрами и пагинацией */
  index(params: AdminTestsParams = {}): Promise<AdminTestsListResponse> {
    return api
      .get<AdminTestsListResponse>('/admin/tests', { params })
      .then((r) => r.data);
  },

  /** Получить метаданные одного теста */
  getById(id: number): Promise<AdminTestMeta> {
    return api.get<AdminTestMeta>(`/admin/tests/${id}`).then((r) => r.data);
  },

  /** Создать новый тест (multipart/form-data с JSON-файлом) */
  create(formData: FormData): Promise<AdminTestMeta> {
    return api
      .post<{ message: string; test: AdminTestMeta }>('/admin/tests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.test);
  },

  /** Обновить тест (multipart/form-data, файл необязателен) */
  update(id: number, formData: FormData): Promise<AdminTestMeta> {
    return api
      .post<{ message: string; test: AdminTestMeta }>(`/admin/tests/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.test);
  },

  /** Удалить тест */
  delete(id: number): Promise<void> {
    return api.delete(`/admin/tests/${id}`).then(() => undefined);
  },

  /** Скачать JSON-файл теста */
  async download(id: number, filename: string): Promise<void> {
    const response = await api.get(`/admin/tests/${id}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || `test_${id}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
