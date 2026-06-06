/**
 * API-клиент для работы с тестами.
 *
 * Запросы идут через Vite-прокси: /api/* → http://localhost:8888/inseptum_backend/api/*
 * Эндпоинты:
 *   GET /api/tests               — список метаданных
 *   GET /api/tests/{id}          — метаданные теста
 *   GET /api/tests/{id}/content  — полный тест с вопросами
 */

import { apiUrl } from './config';

/** Метаданные теста (то, что отдаётся в списке). */
export interface TestMeta {
  id: number;
  title: string;
  description: string;
  category: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  max_score: number;
  time_limit: number | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

/** Вариант ответа. */
export interface TestOption {
  id: string;
  text: string;
}

/** Вопрос теста (формат JSON-файла на бэкенде). */
export interface TestQuestion {
  id: number;
  text: string;
  options: TestOption[];
  correct_answer: string;
}

/** Полный тест (содержимое JSON-файла). */
export interface TestFull {
  id: number;
  title: string;
  description: string;
  time_limit?: number | null;
  passing_score?: number;
  questions: TestQuestion[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success || body.data === undefined) {
    throw new Error(body.error ?? 'API error');
  }
  return body.data;
}

/** Получить список метаданных всех активных тестов. */
export function fetchTests(): Promise<TestMeta[]> {
  return request<TestMeta[]>('/tests');
}

/** Получить метаданные теста по id. */
export function fetchTestById(id: number): Promise<TestMeta> {
  return request<TestMeta>(`/tests/${id}`);
}

/** Получить полный тест с вопросами по id (из JSON-файла). */
export function fetchTestContent(id: number): Promise<TestFull> {
  return request<TestFull>(`/tests/${id}/content`);
}
