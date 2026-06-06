import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import { adminTestsApi, AdminTestMeta } from '@api/adminTestsApi';
import './TestForm.css';

interface TestFormProps {
  test: AdminTestMeta | null;
  onSave: () => void;
  onCancel: () => void;
  submitting: boolean;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Активный',
  draft: 'Черновик',
  archived: 'Архив',
};

const TestForm: React.FC<TestFormProps> = ({ test, onSave, onCancel, submitting }) => {
  const [title, setTitle] = useState(test?.title ?? '');
  const [description, setDescription] = useState(test?.description ?? '');
  const [category, setCategory] = useState(test?.category ?? '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    test?.difficulty ?? 'medium'
  );
  const [maxScore, setMaxScore] = useState<number>(test?.max_score ?? 100);
  const [timeLimit, setTimeLimit] = useState<string>(
    test?.time_limit != null ? String(test.time_limit) : ''
  );
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>(
    test?.status ?? 'draft'
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBusy = loading || submitting;

  const isEditing = test !== null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (title.length < 3) {
      newErrors.title = 'Минимум 3 символа';
    }

    if (maxScore <= 0) {
      newErrors.maxScore = 'Максимальный балл должен быть больше 0';
    }

    if (timeLimit !== '' && (isNaN(Number(timeLimit)) || Number(timeLimit) <= 0)) {
      newErrors.timeLimit = 'Введите корректное время (в минутах)';
    }

    if (!isEditing && !file) {
      newErrors.file = 'Загрузите JSON файл теста';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const validTypes = ['application/json', 'text/plain'];
    const isJson =
      validTypes.includes(selectedFile.type) ||
      selectedFile.name.toLowerCase().endsWith('.json');

    if (!isJson) {
      setErrors((prev) => ({ ...prev, file: 'Только JSON файлы' }));
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'Файл должен быть меньше 10 МБ' }));
      return;
    }

    setFile(selectedFile);
    setPreviewFile(selectedFile.name);
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isBusy) return;

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('category', category.trim());
    formData.append('difficulty', difficulty);
    formData.append('max_score', String(maxScore));
    formData.append('status', status);
    if (timeLimit !== '') {
      formData.append('time_limit', String(Number(timeLimit)));
    }
    if (file) {
      formData.append('file', file);
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, form: '' }));
    try {
      if (isEditing) {
        await adminTestsApi.update(test.id, formData);
      } else {
        await adminTestsApi.create(formData);
      }
      onSave();
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        form: err.response?.data?.error || err.message || 'Ошибка сохранения',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="test-form" onSubmit={handleSubmit}>
      {errors.form && <div className="form-error-banner">{errors.form}</div>}

      {/* Название */}
      <div className="form-group">
        <label htmlFor="tf-title">Название теста</label>
        <input
          id="tf-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название теста"
          className={errors.title ? 'error' : ''}
          disabled={isBusy}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      {/* Описание */}
      <div className="form-group">
        <label htmlFor="tf-description">Описание</label>
        <textarea
          id="tf-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Краткое описание теста (необязательно)"
          rows={3}
          disabled={isBusy}
        />
      </div>

      {/* Категория */}
      <div className="form-group">
        <label htmlFor="tf-category">Категория</label>
        <input
          id="tf-category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Например: Математика, Физика..."
          disabled={isBusy}
        />
      </div>

      {/* Сложность + Статус */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tf-difficulty">Сложность</label>
          <select
            id="tf-difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            disabled={isBusy}
          >
            {Object.entries(DIFFICULTY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tf-status">Статус</label>
          <select
            id="tf-status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as 'active' | 'draft' | 'archived')
            }
            disabled={isBusy}
          >
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Макс. балл + Лимит времени */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tf-maxscore">Максимальный балл</label>
          <input
            id="tf-maxscore"
            type="number"
            min={1}
            value={maxScore}
            onChange={(e) => setMaxScore(Number(e.target.value))}
            className={errors.maxScore ? 'error' : ''}
            disabled={isBusy}
          />
          {errors.maxScore && <span className="error-message">{errors.maxScore}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tf-timelimit">Лимит времени (мин.)</label>
          <input
            id="tf-timelimit"
            type="number"
            min={1}
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            placeholder="Без ограничений"
            className={errors.timeLimit ? 'error' : ''}
            disabled={isBusy}
          />
          {errors.timeLimit && (
            <span className="error-message">{errors.timeLimit}</span>
          )}
        </div>
      </div>

      {/* Загрузка файла */}
      <div className="form-group">
        <label>JSON файл теста</label>
        <div
          className={`file-drop-zone ${dragging ? 'dragging' : ''} ${
            errors.file ? 'error' : ''
          } ${previewFile ? 'has-file' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            disabled={isBusy}
            hidden
          />

          {previewFile ? (
            <div className="file-preview">
              <FiFile className="file-icon" />
              <span className="file-name">{previewFile}</span>
              <button
                type="button"
                className="remove-file"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                disabled={isBusy}
              >
                <FiX />
              </button>
            </div>
          ) : (
            <div className="drop-content">
              <FiUpload className="upload-icon" />
              <p className="drop-text">Перетащите JSON файл сюда</p>
              <p className="drop-hint">или нажмите для выбора</p>
            </div>
          )}
        </div>
        {errors.file && <span className="error-message">{errors.file}</span>}
        {isEditing && (
          <p className="file-hint">
            Текущий файл: {test.filename}. Загрузите новый для замены.
          </p>
        )}
      </div>

      {/* Действия */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={isBusy}
        >
          Отмена
        </button>
        <button type="submit" className="btn-submit" disabled={isBusy}>
          {isBusy ? (
            <span className="loading-text">Сохранение...</span>
          ) : (
            <>
              <FiCheck /> {isEditing ? 'Сохранить' : 'Создать'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TestForm;
