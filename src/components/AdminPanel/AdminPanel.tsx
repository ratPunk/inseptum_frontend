import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { FiSettings, FiUsers, FiFileText, FiBarChart2 } from 'react-icons/fi';
import { RootState } from '@store/store';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div className="admin-panel-title-row">
          <FiSettings size={28} className="admin-panel-icon" />
          <h1 className="admin-panel-title">Админ панель</h1>
        </div>
        <p className="admin-panel-subtitle">Управление контентом и пользователями</p>
      </div>

      <div className="admin-panel-grid">
        <div className="admin-card">
          <div className="admin-card-icon-wrapper admin-card-icon-wrapper--users">
            <FiUsers size={24} />
          </div>
          <h3 className="admin-card-title">Пользователи</h3>
          <p className="admin-card-desc">Управление аккаунтами и ролями</p>
          <span className="admin-card-badge">Скоро</span>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon-wrapper admin-card-icon-wrapper--articles">
            <FiFileText size={24} />
          </div>
          <h3 className="admin-card-title">Статьи</h3>
          <p className="admin-card-desc">Создание и редактирование статей</p>
          <span className="admin-card-badge">Скоро</span>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon-wrapper admin-card-icon-wrapper--stats">
            <FiBarChart2 size={24} />
          </div>
          <h3 className="admin-card-title">Статистика</h3>
          <p className="admin-card-desc">Аналитика и отчёты</p>
          <span className="admin-card-badge">Скоро</span>
        </div>

        <div className="admin-card">
          <div className="admin-card-icon-wrapper admin-card-icon-wrapper--settings">
            <FiSettings size={24} />
          </div>
          <h3 className="admin-card-title">Настройки</h3>
          <p className="admin-card-desc">Конфигурация приложения</p>
          <span className="admin-card-badge">Скоро</span>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;