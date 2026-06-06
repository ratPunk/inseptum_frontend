import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import type { Article } from '@api/articlesApi';
import './ArticleCard.css';

const CATEGORY_CLASS_MAP: Record<string, string> = {
  html: 'article-card__category--html',
  css: 'article-card__category--css',
  javascript: 'article-card__category--javascript',
  react: 'article-card__category--react',
  php: 'article-card__category--php',
  bd: 'article-card__category--bd',
};

interface ArticleCardProps {
  article: Article;
  index?: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, index = 0 }) => {
  const categoryClass = CATEGORY_CLASS_MAP[article.category_slug] ?? '';

  // Single shared image for all articles
  const imageUrl = '/src/style/images/article.webp';

  // Format date
  const formattedDate = new Date(article.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      to={`/articles/${article.id}`}
      className="article-card article-card--animate"
      style={{ animationDelay: `${index * 0.1}s` }}
      aria-label={`Читать статью: ${article.title}`}
    >
      <div className="article-card__image-wrapper">
        <img
          src={imageUrl}
          alt={article.title}
          className="article-card__image"
          loading="lazy"
        />
        <span className={`article-card__category ${categoryClass}`}>
          {article.category_name}
        </span>
      </div>

      <div className="article-card__content">
        <h3 className="article-card__title">{article.title}</h3>
        {article.description && (
          <p className="article-card__summary">{article.description}</p>
        )}

        <div className="article-card__meta">
          <span className="article-card__meta-item">
            <FiCalendar size={14} />
            {formattedDate}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
