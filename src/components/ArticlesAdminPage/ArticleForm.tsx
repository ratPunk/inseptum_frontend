import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import { articlesApi, Article, ArticleCategory } from '@api/articlesApi';
import './ArticleForm.css';

interface ArticleFormProps {
  article: Article | null;
  categories: ArticleCategory[];
  onSave: () => void;
  onCancel: () => void;
  submitting: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  categories,
  onSave,
  onCancel,
  submitting,
}) => {
  const [title, setTitle] = useState(article?.title ?? '');
  const [description, setDescription] = useState(article?.description ?? '');
  const [categoryId, setCategoryId] = useState<number>(
    article?.category_id ?? (categories[0]?.id ?? 0)
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = article !== null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (title.length < 3) {
      newErrors.title = 'Название должно содержать минимум 3 символа';
    }

    if (!categoryId || categoryId <= 0) {
      newErrors.categoryId = 'Выберите категорию';
    }

    if (!isEditing && !file) {
      newErrors.file = 'Загрузите DOCX файл';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setErrors({ ...errors, file: 'Только DOCX файлы' });
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrors({ ...errors, file: 'Файл должен быть меньше 50 МБ' });
      return;
    }

    setFile(selectedFile);
    setPreviewFile(selectedFile.name);
    setErrors({ ...errors, file: '' });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('category_id', categoryId.toString());

    if (file) {
      formData.append('file', file);
    }

    try {
      if (isEditing) {
        await articlesApi.adminUpdate(article.id, formData);
      } else {
        await articlesApi.adminCreate(formData);
      }
      onSave();
    } catch (err: any) {
      setErrors({
        ...errors,
        form: err.response?.data?.error || err.message || 'Ошибка сохранения',
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      {errors.form && (
        <div className="form-error-banner">
          {errors.form}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">Название статьи</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название статьи"
          className={errors.title ? 'error' : ''}
          disabled={submitting}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание (краткое)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Краткое описание статьи (необязательно)"
          rows={3}
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Категория</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className={errors.categoryId ? 'error' : ''}
          disabled={submitting}
        >
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <span className="error-message">{errors.categoryId}</span>
        )}
      </div>

      <div className="form-group">
        <label>DOCX файл</label>
        <div
          className={`file-drop-zone ${dragging ? 'dragging' : ''} ${
            errors.file ? 'error' : ''
          } ${previewFile ? 'has-file' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            disabled={submitting}
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
                disabled={submitting}
              >
                <FiX />
              </button>
            </div>
          ) : (
            <div className="drop-content">
              <FiUpload className="upload-icon" />
              <p className="drop-text">
                Пер��тащите DOCX файл сюда
              </p>
              <p className="drop-hint">или нажмите для выбора</p>
            </div>
          )}
        </div>
        {errors.file && <span className="error-message">{errors.file}</span>}
        {isEditing && (
          <p className="file-hint">
            Текущий файл: {article.filename}. Загрузите новый для замены.
          </p>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="btn-submit"
          disabled={submitting}
        >
          {submitting ? (
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

export default ArticleForm;