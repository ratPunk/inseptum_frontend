import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiLogOut, FiArrowLeft, FiShield, FiSettings } from 'react-icons/fi';
import { RootState } from '@store/store';
import { clearCredentials } from '@store/authSlice';
import type { AppDispatch } from '@store/store';
import { authApi } from '@api/authApi';
import Button from '@/components/ui/Button/Button';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      dispatch(clearCredentials());
      navigate('/login');
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-not-auth">
            <p>Вы не авторизованы</p>
            <Link to="/login">
              <Button variant="primary">Войти</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <Link to="/" className="profile-back">
          <FiArrowLeft size={18} />
          <span>На главную</span>
        </Link>

        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail-item">
            <div className="profile-detail-icon">
              <FiUser size={18} />
            </div>
            <div className="profile-detail-content">
              <span className="profile-detail-label">Имя</span>
              <span className="profile-detail-value">{user.name}</span>
            </div>
          </div>

          <div className="profile-detail-item">
            <div className="profile-detail-icon">
              <FiMail size={18} />
            </div>
            <div className="profile-detail-content">
              <span className="profile-detail-label">Логин</span>
              <span className="profile-detail-value">{user.login}</span>
            </div>
          </div>

          <div className="profile-detail-item">
            <div className="profile-detail-icon">
              <FiCalendar size={18} />
            </div>
            <div className="profile-detail-content">
              <span className="profile-detail-label">Дата регистрации</span>
              <span className="profile-detail-value">{formatDate(user.created_at)}</span>
            </div>
          </div>

          <div className="profile-detail-item">
            <div className="profile-detail-icon">
              <FiShield size={18} />
            </div>
            <div className="profile-detail-content">
              <span className="profile-detail-label">Роль</span>
              <span className="profile-detail-value">
                {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {user.role === 'admin' && (
            <Link to="/admin">
              <Button
                variant="primary"
                leftIcon={<FiSettings size={16} />}
              >
                Админ панель
              </Button>
            </Link>
          )}
          <Button
            variant="secondary"
            onClick={handleLogout}
            leftIcon={<FiLogOut size={16} />}
          >
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;