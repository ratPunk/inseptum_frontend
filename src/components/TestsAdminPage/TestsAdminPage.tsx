import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiDownload,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiAward,
} from 'react-icons/fi';
import { adminTestsApi, AdminTestMeta } from '@api/adminTestsApi';
import { RootState } from '@store/store';
import { Navigate } from 'react-router-dom';
import TestForm from './TestForm';
import './TestsAdminPage.css';

/* ─── Types ─── */
interface FiltersState {
  search: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | '';
  status: 'active' | 'draft' | 'archived' | '';
  sortBy: 'title' | 'created_at' | 'updated_at' | 'difficulty';
  sortOrder: 'asc' | 'desc';
}

interface PaginationState {
  page: number;
  totalPages: number;
  total: number;
}

/* ─── Helpers ─── */
const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'badge--easy',
  medium: 'badge--medium',
  hard: 'badge--hard',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'status--active',
  draft: 'status--draft',
  archived: 'status--archived',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Активный',
  draft: 'Черновик',
  archived: 'Архив',
};

/* ─── Component ─── */
const TestsAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  const [tests, setTests] = useState<AdminTestMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    category: '',
    difficulty: '',
    status: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingTest, setEditingTest] = useState<AdminTestMeta | null>(null);
  const [deletingTest, setDeletingTest] = useState<AdminTestMeta | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ─── Data Loading ─── */
  const loadTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminTestsApi.index({
        search: filters.search || undefined,
        category: filters.category || undefined,
        difficulty: filters.difficulty || undefined,
        status: filters.status || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        page: pagination.page,
        limit: 12,
      });
      setTests(response.tests);
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Ошибка загрузки тестов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, [filters, pagination.page]);

  /* ─── Handlers ─── */
  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (column: FiltersState['sortBy']) => {
    if (filters.sortBy === column) {
      setFilters((prev) => ({
        ...prev,
        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
      }));
    } else {
      setFilters((prev) => ({ ...prev, sortBy: column, sortOrder: 'desc' }));
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await loadTests();
      setShowForm(false);
      setEditingTest(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTest) return;
    setSubmitting(true);
    try {
      await adminTestsApi.delete(deletingTest.id);
      await loadTests();
      setDeletingTest(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка удаления');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = () => {
    setEditingTest(null);
    setShowForm(true);
  };

  const handleEdit = (test: AdminTestMeta) => {
    setEditingTest(test);
    setShowForm(true);
  };

  const handleDownload = async (test: AdminTestMeta) => {
    try {
      await adminTestsApi.download(test.id, test.filename);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Ошибка скачивания файла');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      difficulty: '',
      status: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== '' ||
    filters.difficulty !== '' ||
    filters.status !== '';

  const SortIcon: React.FC<{ col: FiltersState['sortBy'] }> = ({ col }) => {
    if (filters.sortBy !== col) return null;
    return filters.sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />;
  };

  /* ─── Render ─── */
  return (
    <div className="tests-admin">
      {/* Header */}
      <div className="tests-admin-header">
        <div className="tests-admin-title-row">
          <h1 className="tests-admin-title">Управление тестами</h1>
          <button className="btn-create" onClick={handleCreate}>
            <FiPlus /> Создать тест
          </button>
        </div>
        <p className="tests-admin-subtitle">Всего: {pagination.total} тестов</p>
      </div>

      {/* Controls */}
      <div className="tests-admin-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
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
            className={`filter-toggle ${showFilters ? 'active' : ''} ${
              hasActiveFilters ? 'has-filters' : ''
            }`}
            onClick={() => setShowFilters((v) => !v)}
          >
            <FiFilter /> Фильтры
            {hasActiveFilters && <span className="filter-badge" />}
          </button>
          <button
            className="clear-all-btn"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Сбросить
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Категория</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              placeholder="Все категории"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Сложность</label>
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="filter-select"
            >
              <option value="">Все</option>
              <option value="easy">Лёгкий</option>
              <option value="medium">Средний</option>
              <option value="hard">Сложный</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Статус</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">Все</option>
              <option value="active">Активный</option>
              <option value="draft">Черновик</option>
              <option value="archived">Архив</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Сортировка</label>
            <div className="sort-buttons">
              <button
                className={`sort-btn ${filters.sortBy === 'title' ? 'active' : ''}`}
                onClick={() => handleSort('title')}
              >
                По названию <SortIcon col="title" />
              </button>
              <button
                className={`sort-btn ${
                  filters.sortBy === 'created_at' ? 'active' : ''
                }`}
                onClick={() => handleSort('created_at')}
              >
                По дате <SortIcon col="created_at" />
              </button>
              <button
                className={`sort-btn ${
                  filters.sortBy === 'difficulty' ? 'active' : ''
                }`}
                onClick={() => handleSort('difficulty')}
              >
                По сложности <SortIcon col="difficulty" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="tests-admin-loading">
          <div className="loading-spinner" />
          <p>Загрузка тестов...</p>
        </div>
      ) : error ? (
        <div className="tests-admin-error">
          <p>{error}</p>
          <button onClick={loadTests}>Повторить</button>
        </div>
      ) : tests.length === 0 ? (
        <div className="tests-admin-empty">
          <p>Тесты не найдены</p>
          {hasActiveFilters && (
            <button onClick={clearFilters}>Сбросить фильтры</button>
          )}
        </div>
      ) : (
        <>
          <div className="tests-grid">
            {tests.map((test) => (
              <div key={test.id} className="test-card">
                {/* Card Header */}
                <div className="test-card-header">
                  <div className="test-card-badges">
                    <span
                      className={`difficulty-badge ${
                        DIFFICULTY_COLORS[test.difficulty] ?? ''
                      }`}
                    >
                      {DIFFICULTY_LABELS[test.difficulty] ?? test.difficulty}
                    </span>
                    <span
                      className={`status-badge ${
                        STATUS_COLORS[test.status] ?? ''
                      }`}
                    >
                      {STATUS_LABELS[test.status] ?? test.status}
                    </span>
                  </div>
                  <div className="test-card-actions">
                    <button
                      className="action-btn view"
                      title="Перейти к тесту"
                      onClick={() => navigate(`/tests`)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="action-btn download"
                      title="Скачать JSON"
                      onClick={() => handleDownload(test)}
                    >
                      <FiDownload />
                    </button>
                    <button
                      className="action-btn edit"
                      title="Редактировать"
                      onClick={() => handleEdit(test)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Удалить"
                      onClick={() => setDeletingTest(test)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="test-card-body">
                  {test.category && (
                    <span className="test-category">{test.category}</span>
                  )}
                  <h3 className="test-title">{test.title}</h3>
                  {test.description && (
                    <p className="test-description">{test.description}</p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="test-card-footer">
                  <div className="test-meta">
                    <span className="meta-item">
                      <FiAward size={12} />
                      {test.max_score} баллов
                    </span>
                    {test.time_limit && (
                      <span className="meta-item">
                        <FiClock size={12} />
                        {test.time_limit} мин.
                      </span>
                    )}
                  </div>
                  <div className="test-dates">
                    {test.created_at && (
                      <span className="meta-date">
                        {new Date(test.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
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
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page - 1 }))
                }
              >
                <FiChevronLeft /> Назад
              </button>
              <div className="pagination-info">
                Страница {pagination.page} из {pagination.totalPages}
              </div>
              <button
                className="pagination-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
              >
                Вперед <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTest ? 'Редактирование теста' : 'Создание теста'}</h2>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
                aria-label="Закрыть"
              >
                <FiX />
              </button>
            </div>
            <TestForm
              test={editingTest}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTest && (
        <div className="modal-overlay" onClick={() => setDeletingTest(null)}>
          <div
            className="modal-content modal-confirm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Удаление теста</h2>
              <button
                className="modal-close"
                onClick={() => setDeletingTest(null)}
                aria-label="Закрыть"
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>Вы уверены, что хотите удалить тест:</p>
              <p className="delete-test-title">"{deletingTest.title}"</p>
              <p className="delete-warning">Это действие нельзя отменить.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setDeletingTest(null)}
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

export default TestsAdminPage;
