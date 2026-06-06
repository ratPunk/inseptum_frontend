import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUser, FiCalendar, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { articlesApi, type TocEntry } from '@api/articlesApi';
import TableOfContents from '@components/TableOfContents/TableOfContents';
import Button from '@components/ui/Button/Button';
import articleImage from '@/style/images/article.webp';
import './ArticlePage.css';

interface ArticleData {
  id: number;
  title: string;
  description?: string | null;
  category_name: string;
  category_slug: string;
  author_id?: number | null;
  created_at: string;
}

interface ArticleContent {
  article: ArticleData;
  html: string;
  toc: TocEntry[];
  wordCount: number;
}

type LoadState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Convert heading text to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^а-яёa-z0-9\s-]/g, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, '-')              // Replace spaces with hyphens
    .replace(/-+/g, '-')               // Remove consecutive hyphens
    .trim();
}

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ArticleContent | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [error, setError] = useState<{ message: string; retryable: boolean } | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const htmlRef = useRef<HTMLDivElement | null>(null);

  // Click handler for headings inside the article HTML — event delegation
  const handleHtmlClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const heading = target.closest('h1, h2, h3, h4, h5, h6') as HTMLElement | null;
    if (!heading || !heading.id) return;

    e.preventDefault();

    const headerOffset = 80;
    const elementPosition = heading.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // Update URL hash without scroll jump
    const newUrl = `${window.location.pathname}${window.location.search}#${heading.id}`;
    window.history.pushState({ tocScroll: true }, '', newUrl);
  }, []);

  // Fetch article content from backend with retry support
  const fetchArticle = React.useCallback(async () => {
    const numericId = parseInt(id ?? '', 10);
    if (isNaN(numericId) || numericId <= 0) {
      setError({ message: 'Некорректный ID статьи', retryable: false });
      setLoadState('error');
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoadState('loading');
    setError(null);

    try {
      const result = await articlesApi.content(numericId);
      setData(result);
      setLoadState('success');
    } catch (err: any) {
      // Don't update state if request was aborted
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        return;
      }

      const status = err?.response?.status;
      const serverError = err?.response?.data?.error;
      
      // Determine if error is retryable
      const retryable = status === 500 || status === 502 || status === 503 || !status;
      
      // Provide user-friendly error messages
      let message = serverError ?? err.message ?? 'Неизвестная ошибка';
      
      if (status === 404) {
        message = 'Статья не найдена';
      } else if (status === 403) {
        message = 'Доступ запрещён';
      } else if (status === 401) {
        message = 'Необходима авторизация';
      } else if (retryable && !message.includes('Не удалось')) {
        message = 'Ошибка сервера. Попробуйте обновить страницу.';
      }

      setError({ message, retryable });
      setLoadState('error');
    }
  }, [id]);

  useEffect(() => {
    fetchArticle();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchArticle]);

  // Inject IDs into HTML headings to match TOC entries, then set up scroll spy
  useEffect(() => {
    if (!data?.toc?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0,
      },
    );

    // Inject IDs into headings after HTML is rendered, then observe them
    const timeoutId = setTimeout(() => {
      const htmlContainer = htmlRef.current;
      if (!htmlContainer) return;

      // Find all headings and inject slugs matching TOC entries
      const headings = htmlContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let tocIndex = 0;

      headings.forEach((heading) => {
        if (tocIndex < data.toc.length) {
          if (!heading.id) {
            // Use slugified text to match TOC links
            heading.id = slugify(data.toc[tocIndex].text);
          }
          tocIndex++;
        }
      });

      // Now observe all headings with slugs
      data.toc.forEach((entry) => {
        const el = document.getElementById(slugify(entry.text));
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [data]);

  // Loading skeleton state
  if (loadState === 'idle' || loadState === 'loading') {
    return (
      <div className="article-page article-page--loading">
        <div className="article-page__skeleton">
          <div className="skeleton skeleton--back" />
          <div className="skeleton skeleton--hero" />
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--meta" />
          <div className="article-page__content-grid">
            <div className="skeleton skeleton--toc" />
            <div className="skeleton skeleton--body" />
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (loadState === 'error') {
    return (
      <div className="article-page__not-found">
        <FiAlertCircle size={48} className="article-page__error-icon" />
        <h1 className="article-page__not-found-title">Ошибка загрузки</h1>
        <p className="article-page__not-found-text">{error?.message ?? 'Статья не найдена'}</p>
        <div className="article-page__error-actions">
          {error?.retryable && (
            <Button
              variant="primary"
              onClick={fetchArticle}
              leftIcon={<FiRefreshCw size={16} />}
            >
              Повторить
            </Button>
          )}
          <Link to="/articles" className="article-page__back">
            <FiArrowLeft size={16} />
            Все статьи
          </Link>
        </div>
      </div>
    );
  }

  // No data state (shouldn't happen after success, but safety check)
  if (!data) {
    return (
      <div className="article-page__not-found">
        <h1 className="article-page__not-found-title">Ошибка</h1>
        <p className="article-page__not-found-text">Не удалось загрузить статью</p>
        <Link to="/articles" className="article-page__back">
          <FiArrowLeft size={16} />
          Все статьи
        </Link>
      </div>
    );
  }

  const { article, html, toc, wordCount } = data;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="article-page">
      <Link to="/articles" className="article-page__back">
        <FiArrowLeft size={16} />
        Все статьи
      </Link>

      {/* Hero image */}
      <div className="article-page__hero">
        <img
          src={articleImage}
          alt={article.title}
          className="article-page__hero-image"
        />
      </div>

      <div className="article-page__meta">
        <span className="article-page__category-badge">
          {article.category_name}
        </span>
        <span className="article-page__meta-item">
          <FiUser size={14} />
          Inseptum
        </span>
        <span className="article-page__meta-item">
          <FiClock size={14} />
          {readTime} мин
        </span>
        <span className="article-page__meta-item">
          <FiCalendar size={14} />
          {new Date(article.created_at).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      <h1 className="article-page__title">{article.title}</h1>

      {article.description && (
        <p className="article-page__description">{article.description}</p>
      )}

      <hr className="article-page__divider" />

      {/* Two-column layout: TOC sidebar + content */}
      <div className="article-page__body">
        {toc.length > 0 && (
          <aside className="article-page__sidebar">
            <TableOfContents entries={toc} activeId={activeHeadingId} />
          </aside>
        )}

        <div className="article-page__content">
          {/* Server-rendered semantic HTML — server already escaped all user input */}
          <div
            ref={htmlRef}
            className="article-page__html"
            dangerouslySetInnerHTML={{ __html: html }}
            onClick={handleHtmlClick}
          />
        </div>
      </div>
    </article>
  );
};

export default ArticlePage;
