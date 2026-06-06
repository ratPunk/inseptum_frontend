import api from './authApi';

/* ─── Types ─── */

export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  description?: string;
  filename: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  author_id?: number;
  created_at: string;
  updated_at: string;
}

/** Table of contents entry */
export interface TocEntry {
  id: string;
  level: number;
  text: string;
}

/** Full article content response from server */
export interface ArticleContentResponse {
  article: Article;
  /** Pre-rendered semantic HTML — safe to use via dangerouslySetInnerHTML */
  html: string;
  /** Heading hierarchy for navigation */
  toc: TocEntry[];
  /** Estimated word count */
  wordCount: number;
}

/* ─── API Response wrapper for better error handling ─── */

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/* ─── Fallback: Minimal content when /content endpoint is unavailable ─── */
export interface ArticleContentFallback {
  article: Article;
  html: string;
  toc: TocEntry[];
  wordCount: number;
}

/* ─── Endpoints ─── */

export const articlesApi = {
  /** Get all articles, optionally filtered by category */
  index: (categoryId?: number) =>
    api
      .get<{ articles: Article[] }>('/articles', {
        params: categoryId ? { category_id: categoryId } : undefined,
      })
      .then((r) => r.data.articles),

  /** Get a single article by ID */
  show: (id: number) =>
    api
      .get<{ article: Article }>(`/articles/${id}`)
      .then((r) => r.data.article),

  /**
   * Get article content — pre-rendered HTML + TOC from DOCX.
   * 
   * Implements automatic fallback strategy:
   * 1. Try GET /articles/:id/content (primary endpoint)
   * 2. If fails with 404/500, try GET /articles/:id/raw (fallback)
   * 3. If all fail, construct minimal content from article metadata
   * 
   * @param id - Article ID
   * @returns ArticleContentResponse with HTML, TOC, and metadata
   */
  content: async (id: number): Promise<ArticleContentResponse> => {
    // Validate input
    if (!id || id <= 0) {
      return Promise.reject(new Error('Некорректный ID статьи'));
    }

    const article = await articlesApi.show(id);

    // Strategy 1: Try dedicated content endpoint
    try {
      const response = await api.get<ArticleContentResponse>(`/articles/${id}/content`);
      return {
        article,
        html: response.data.html,
        toc: response.data.toc,
        wordCount: response.data.wordCount,
      };
    } catch (contentError: any) {
      const status = contentError?.response?.status;
      
      // Only try fallback for client/server errors (not auth errors)
      if (status === 404 || status === 500 || status === 502 || status === 503) {
        console.warn(`[articlesApi] /content endpoint unavailable (${status}), trying fallback...`);
        
        // Strategy 2: Try raw endpoint
        try {
          const rawResponse = await api.get<{ html: string; wordCount?: number }>(`/articles/${id}/raw`);
          return {
            article,
            html: rawResponse.data.html,
            toc: generateTocFromHtml(rawResponse.data.html),
            wordCount: rawResponse.data.wordCount ?? estimateWordCount(rawResponse.data.html),
          };
        } catch (rawError: any) {
          const rawStatus = rawError?.response?.status;
          if (rawStatus && rawStatus < 500 && rawStatus !== 401 && rawStatus !== 403) {
            console.warn(`[articlesApi] /raw endpoint unavailable (${rawStatus}), using embedded content...`);
          }
        }

        // Strategy 3: Use description as minimal fallback HTML
        if (article.description) {
          return {
            article,
            html: `<div class="article-fallback"><p>${escapeHtml(article.description)}</p></div>`,
            toc: [],
            wordCount: article.description.split(/\s+/).length,
          };
        }

        // Strategy 4: Minimal placeholder
        return {
          article,
          html: `<div class="article-placeholder"><p>Контент статьи временно недоступен.</p></div>`,
          toc: [],
          wordCount: 6,
        };
      }

      // For auth errors or other unexpected errors, propagate original error
      const errorMsg = contentError?.response?.data?.error ?? contentError?.message ?? 'Не удалось загрузить контент статьи';
      return Promise.reject(new Error(errorMsg));
    }
  },

  /** Create a new article with DOCX upload */
  create: (data: FormData) =>
    api
      .post<{ message: string; article: Article }>('/articles', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  /** Update an article (optionally replace DOCX) */
  update: (id: number, data: FormData) =>
    api
      .put<{ message: string; article: Article }>(`/articles/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  /** Delete an article */
  delete: (id: number) =>
    api
      .delete<{ message: string }>(`/articles/${id}`)
      .then((r) => r.data),

  /** Admin: Get all articles with filtering and sorting */
  adminIndex: (options: {
    categoryId?: number;
    search?: string;
    sortBy?: 'title' | 'created_at' | 'updated_at';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  } = {}) =>
    api
      .get<{ articles: Article[]; total: number; page: number; totalPages: number }>('/admin/articles', {
        params: {
          category_id: options.categoryId,
          search: options.search,
          sort_by: options.sortBy,
          sort_order: options.sortOrder,
          page: options.page ?? 1,
          limit: options.limit ?? 12,
        },
      })
      .then((r) => r.data),

  /** Admin: Get single article for editing */
  adminShow: (id: number) =>
    api
      .get<{ article: Article }>(`/admin/articles/${id}`)
      .then((r) => r.data),

  /** Admin: Create article */
  adminCreate: (data: FormData) =>
    api
      .post<{ message: string; article: Article }>('/admin/articles', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  /** Admin: Update article */
  adminUpdate: (id: number, data: FormData) =>
    api
      .put<{ message: string; article: Article }>(`/admin/articles/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  /** Admin: Delete article */
  adminDelete: (id: number) =>
    api
      .delete<{ message: string }>(`/admin/articles/${id}`)
      .then((r) => r.data),

  /** Admin: Download article DOCX file */
  adminDownload: (id: number, filename: string) =>
    api
      .get(`/admin/articles/${id}/download`, { responseType: 'blob' })
      .then((r) => {
        const url = window.URL.createObjectURL(new Blob([r.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }),

  /** Admin: Get all categories */
  adminCategories: () =>
    api
      .get<{ categories: ArticleCategory[] }>('/admin/categories')
      .then((r) => r.data.categories),
};

/* ─── Helper functions for fallback content ─── */

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Estimate word count from HTML content
 */
function estimateWordCount(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

/**
 * Generate table of contents from HTML headings
 */
function generateTocFromHtml(html: string): TocEntry[] {
  const toc: TocEntry[] = [];
  const headingRegex = /<h([2-6])[^>]*>([^<]*)<\/h[2-6]>/gi;
  let match;
  let counter = 0;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].trim();
    const id = `heading-${counter++}`;
    toc.push({ id, level, text });
  }

  return toc;
}

/* ─── Categories API ─── */

export const categoriesApi = {
  /** Get all categories */
  index: () =>
    api
      .get<{ categories: ArticleCategory[] }>('/categories')
      .then((r) => r.data.categories),

  /** Get a single category */
  show: (id: number) =>
    api
      .get<{ category: ArticleCategory }>(`/categories/${id}`)
      .then((r) => r.data.category),

  /** Create a category */
  create: (data: { name: string; slug: string; description?: string }) =>
    api
      .post<{ message: string; category: ArticleCategory }>('/categories', data)
      .then((r) => r.data),

  /** Update a category */
  update: (id: number, data: { name?: string; slug?: string; description?: string }) =>
    api
      .put<{ message: string; category: ArticleCategory }>(`/categories/${id}`, data)
      .then((r) => r.data),

  /** Delete a category */
  delete: (id: number) =>
    api
      .delete<{ message: string }>(`/categories/${id}`)
      .then((r) => r.data),
};
