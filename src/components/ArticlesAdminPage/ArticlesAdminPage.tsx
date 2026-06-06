import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus, FiSearch, FiFilter, FiArrowUp, FiArrowDown,
  FiEdit2, FiTrash2, FiEye, FiDownload, FiX, FiCheck, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { articlesApi, Article, ArticleCategory } from '@api/articlesApi';
import ArticleForm from './ArticleForm';
import './ArticlesAdminPage.css';

interface FiltersState {
  categoryId: number | null;
  search: string;
  sortBy: 'title' | 'created_at' | 'updated_at';
  sortOrder: 'asc' | 'desc';
}

interface PaginationState {
  page: number;
  totalPages: number;
  total: number;
}

const ArticlesAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FiltersState>({
    categoryId: null,
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load articles
  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await articlesApi.adminIndex({
        categoryId: filters.categoryId ?? undefined,
        search: filters.search || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: pagination.page,
        limit: 12,
      });
      setArticles(response.articles);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Ошибка загрузки статей');
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const cats = await articlesApi.adminCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [filters, pagination.page]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle sort toggle
  const handleSort = (column: FiltersState['sortBy']) => {
    if (filters.sortBy === column) {
      setFilters(prev => ({
        ...prev,
        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
      }));
    } else {
      setFilters(prev => ({ ...prev, sortBy: column, sortOrder: 'desc' }));
    }
  };

  // Handle create/edit
  const handleSave = async () => {
    setSubmitting(true);
    try {
      await loadArticles();
      setShowForm(false);
      setEditingArticle(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingArticle) return;
    setSubmitting(true);
    try {
      await articlesApi.adminDelete(deletingArticle.id);
      await loadArticles();
      setDeletingArticle(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка удаления');
    } finally {
      setSubmitting(false);
    }
  };

  // Open create modal
  const handleCreate = () => {
    setEditingArticle(null);
    setShowForm(true);
  };

  // Open edit modal
  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  // Download article file
  const handleDownload = async (article: Article) => {
    try {
      await articlesApi.adminDownload(article.id, article.filename);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка скачивания файла');
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      categoryId: null,
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = filters.categoryId !== null || filters.search !== '';

  return (
    <div className="articles-admin">
      {/* Header */}
      <div className="articles-admin-header">
        <div className="articles-admin-title-row">
          <h1 className="articles-admin-title">Управление статьями</h1>
          <button className="btn-create" onClick={handleCreate}>
            <FiPlus /> Создать статью
          </button>
        </div>
        <p className="articles-admin-subtitle">
          Всего: {pagination.total} статей
        </p>
      </div>

      {/* Controls Bar */}
      <div className="articles-admin-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
            aria-label="Поиск статей"
          />
          {filters.search && (
            <button 
              className="clear-search" 
              onClick={() => handleFilterChange('search', '')}
              aria-label="Очистить поиск"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="control-buttons">
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Переключить фильтры"
          >
            <FiFilter /> Фильтры
            {hasActiveFilters && <span className="filter-badge" />}
          </button>

          <button className="clear-all-btn" onClick={clearFilters} disabled={!hasActiveFilters}>
            Сбросить
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Категория</label>
            <select
              value={filters.categoryId ?? ''}
              onChange={(e) => handleFilterChange('categoryId', e.target.value ? Number(e.target.value) : null)}
              className="filter-select"
              aria-label="Фильтр по категории"
            >
              <option value="">Все категории</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Сортировка</label>
            <div className="sort-buttons">
              <button 
                className={`sort-btn ${filters.sortBy === 'title' ? 'active' : ''}`}
                onClick={() => handleSort('title')}
              >
                По названию 
                {filters.sortBy === 'title' && (
                  filters.sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                )}
              </button>
              <button 
                className={`sort-btn ${filters.sortBy === 'created_at' ? 'active' : ''}`}
                onClick={() => handleSort('created_at')}
              >
                По дате создания 
                {filters.sortBy === 'created_at' && (
                  filters.sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                )}
              </button>
              <button 
                className={`sort-btn ${filters.sortBy === 'updated_at' ? 'active' : ''}`}
                onClick={() => handleSort('updated_at')}
              >
                По дате изменения 
                {filters.sortBy === 'updated_at' && (
                  filters.sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="articles-admin-loading">
          <div className="loading-spinner" />
          <p>Загрузка статей...</p>
        </div>
      ) : error ? (
        <div className="articles-admin-error">
          <p>{error}</p>
          <button onClick={loadArticles}>Повторить</button>
        </div>
      ) : articles.length === 0 ? (
        <div className="articles-admin-empty">
          <p>Статьи не найдены</p>
          {hasActiveFilters && (
            <button onClick={clearFilters}>Сбросить фильтры</button>
          )}
        </div>
      ) : (
        <>
          {/* Articles Grid */}
          <div className="articles-grid">
            {articles.map(article => (
              <div key={article.id} className="article-card">
                <div className="article-card-header">
                  <span className="article-category-badge">
                    {article.category_name}
                  </span>
                  <div className="article-card-actions">
                    <button 
                      className="action-btn view" 
                      title="Просмотр"
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      <FiEye />
                    </button>
                    <button 
                      className="action-btn download" 
                      title="Скачать файл"
                      onClick={() => handleDownload(article)}
                    >
                      <FiDownload />
                    </button>
                    <button 
                      className="action-btn edit" 
                      title="Редактировать"
                      onClick={() => handleEdit(article)}
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="action-btn delete" 
                      title="Удалить"
                      onClick={() => setDeletingArticle(article)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                
                <div className="article-card-body">
                  <h3 className="article-title">{article.title}</h3>
                  {article.description && (
                    <p className="article-description">{article.description}</p>
                  )}
                </div>

                <div className="article-card-footer">
                  <div className="article-meta">
                    <span className="meta-date" title="Создано">
                      Создано: {new Date(article.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    {article.updated_at !== article.created_at && (
                      <span className="meta-date" title="Изменено">
                        Изменено: {new Date(article.updated_at).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                  <span className="article-file">{article.filename}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={pagination.page <= 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              >
                <FiChevronLeft /> Назад
              </button>
              
              <div className="pagination-info">
                Страница {pagination.page} из {pagination.totalPages}
              </div>
              
              <button
                className="pagination-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              >
                Вперед <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingArticle ? 'Редактирование статьи' : 'Создание статьи'}</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowForm(false)}
                aria-label="Закрыть"
              >
                <FiX />
              </button>
            </div>
            <ArticleForm
              article={editingArticle}
              categories={categories}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingArticle && (
        <div className="modal-overlay" onClick={() => setDeletingArticle(null)}>
          <div className="modal-content modal-confirm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Удаление статьи</h2>
              <button 
                className="modal-close" 
                onClick={() => setDeletingArticle(null)}
                aria-label="Закрыть"
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>Вы уверены, что хотите удалить статью:</p>
              <p className="delete-article-title">"{deletingArticle.title}"</p>
              <p className="delete-warning">Это действие нельзя отменить.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={() => setDeletingArticle(null)}
                disabled={submitting}
              >
                Отмена
              </button>
              <button 
                className="btn-delete" 
                onClick={handleDelete}
                disabled={submitting}
              >
                <FiTrash2 /> Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesAdminPage;