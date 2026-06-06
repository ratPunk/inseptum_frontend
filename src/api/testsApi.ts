/**
 * API-клиент для работы с тестами.
 *
 * Запросы идут через Vite-прокси: /api/* → http://localhost:8888/inseptum_backend/api/*
 * Эндпоинты:
 *   GET  /api/tests               — список метаданных
 *   GET  /api/tests/{id}          — метаданные теста
 *   GET  /api/tests/{id}/content  — полный тест с вопросами
 *   POST /api/tests/{id}/submit   — отправить ответы пользователя
 *   GET  /api/tests/results       — список результатов текущего пользователя
 */

import api from './authApi';
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

/* ─── Submit / Results ─── */

/** Один ответ пользователя на вопрос. */
export interface SubmitAnswer {
  question_id: number;
  answer: string;
}

/** Тело запроса POST /tests/{id}/submit. */
export interface SubmitAnswersPayload {
  answers: SubmitAnswer[];
}

/** Результат попытки, возвращаемый бэкендом после сабмита. */
export interface TestAttemptResult {
  attempt_id: number;
  test_id: number;
  score: number;
  max_score: number;
  passed: boolean;
  correct_answers: number;
  total_questions: number;
  created_at: string;
}

/** Краткий результат теста из списка пройденных. */
export interface UserTestResult {
  test_id: number;
  passed: boolean;
  score: number;
  max_score: number;
  created_at: string;
}

/**
 * Отправить ответы пользователя и сохранить попытку в БД.
 * POST /api/tests/{id}/submit
 */
export function submitTest(
  id: number,
  payload: SubmitAnswersPayload,
): Promise<TestAttemptResult> {
  return api
    .post<{ success: boolean; data: TestAttemptResult }>(
      `/tests/${id}/submit`,
      payload,
    )
    .then((r) => r.data.data);
}

/**
 * Получить список результатов текущего авторизованного пользователя.
 * GET /api/tests/results
 */
export function fetchMyResults(): Promise<UserTestResult[]> {
  return api
    .get<{ success: boolean; data: UserTestResult[] }>('/tests/results')
    .then((r) => r.data.data);
}
