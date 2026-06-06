import React, { useState, useEffect } from 'react';
import { articlesApi, type Article } from '@api/articlesApi';
import ArticleCard from '@components/ArticleCard/ArticleCard';
import './ArticlesPage.css';

const ALL_CATEGORY = 'Все';

const ArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories and articles
  useEffect(() => {
    Promise.all([
      articlesApi.index(),
      // Categories are loaded separately for the filter
    ])
      .then(([articlesData]) => {
        setArticles(articlesData);

        // Build category list from articles
        const uniqueCategories = [...new Set(articlesData.map((a) => a.category_name))];
        setCategories([ALL_CATEGORY, ...uniqueCategories]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message ?? 'Не удалось загрузить статьи');
        setLoading(false);
      });
  }, []);

  // Filter articles by category
  const filtered =
    activeCategory === ALL_CATEGORY
      ? articles
      : articles.filter((a) => a.category_name === activeCategory);

  if (loading) {
    return (
      <div className="articles-page">
        <header className="articles-page__header">
          <h1 className="articles-page__title">Статьи</h1>
          <p className="articles-page__subtitle">
            Полезные материалы по веб-разработке и программированию
          </p>
        </header>
        <div className="articles-page__loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="articles-page">
        <header className="articles-page__header">
          <h1 className="articles-page__title">Статьи</h1>
          <p className="articles-page__subtitle">
            Полезные материалы по веб-разработке и программированию
          </p>
        </header>
        <div className="articles-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <header className="articles-page__header">
        <h1 className="articles-page__title">Статьи</h1>
        <p className="articles-page__subtitle">
          Полезные материалы по веб-разработке и программированию
        </p>
      </header>

      <nav className="articles-page__filters" aria-label="Фильтр по категориям">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`articles-page__filter-btn${
              activeCategory === cat ? ' articles-page__filter-btn--active' : ''
            }`}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </nav>

      {filtered.length > 0 ? (
        <div className="articles-page__grid">
          {filtered.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      ) : (
        <div className="articles-page__empty" role="status">
          <p className="articles-page__empty-text">Нет статей в этой категории</p>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;