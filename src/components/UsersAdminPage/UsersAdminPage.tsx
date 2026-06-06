import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiArrowLeft, FiPlus, FiSearch, FiEdit2, FiTrash2,
  FiShield, FiUser, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { RootState } from '@store/store';
import { usersApi, AdminUser, CreateUserPayload, UpdateUserPayload } from '@api/usersApi';
import { UserRole } from '@api/authApi';
import './UsersAdminPage.css';

const UsersAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | 'role'>('create');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    login: '',
    email: '',
    password: '',
    role: 'user' as UserRole,
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await usersApi.index({
        search: search || undefined,
        role: roleFilter || undefined,
        page,
        limit: 12,
      });
      setUsers(result.users);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  const openCreateModal = () => {
    setFormData({ name: '', login: '', email: '', password: '', role: 'user' });
    setSelectedUser(null);
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (user: AdminUser) => {
    setFormData({ name: user.name, login: user.login, email: user.email || '', password: '', role: user.role });
    setSelectedUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  const openDeleteModal = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode('delete');
    setShowModal(true);
  };

  const openRoleModal = (user: AdminUser) => {
    setFormData({ ...formData, role: user.role === 'admin' ? 'user' : 'admin' });
    setSelectedUser(user);
    setModalMode('role');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const payload: CreateUserPayload = {
          name: formData.name,
          login: formData.login,
          password: formData.password,
          role: formData.role,
        };
        if (formData.email) payload.email = formData.email;
        await usersApi.create(payload);
      } else if (modalMode === 'edit' && selectedUser) {
        const payload: UpdateUserPayload = {};
        if (formData.name !== selectedUser.name) payload.name = formData.name;
        if (formData.login !== selectedUser.login) payload.login = formData.login;
        if (formData.email !== (selectedUser.email || '')) payload.email = formData.email;
        if (formData.password) payload.password = formData.password;
        if (formData.role !== selectedUser.role) payload.role = formData.role;
        await usersApi.update(selectedUser.id, payload);
      } else if (modalMode === 'delete' && selectedUser) {
        await usersApi.delete(selectedUser.id);
      } else if (modalMode === 'role' && selectedUser) {
        await usersApi.changeRole(selectedUser.id, formData.role);
      }
      closeModal();
      loadUsers();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="users-admin">
      <div className="users-admin-header">
        <div className="users-admin-header-left">
          <button className="users-admin-back-btn" onClick={() => navigate('/admin')}>
            <FiArrowLeft size={16} /> Назад
          </button>
          <h1 className="users-admin-title">Пользователи ({total})</h1>
        </div>
        <button className="users-admin-add-btn" onClick={openCreateModal}>
          <FiPlus size={16} /> Добавить
        </button>
      </div>

      <div className="users-admin-toolbar">
        <div className="users-admin-search">
          <FiSearch size={16} className="users-admin-search-icon" />
          <input
            type="text"
            placeholder="Поиск по имени или логину..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="users-admin-role-filter"
          value={roleFilter}
          aria-label="Фильтр по роли"
          onChange={(e) => { setRoleFilter(e.target.value as UserRole | ''); setPage(1); }}
        >
          <option value="">Все роли</option>
          <option value="admin">Администраторы</option>
          <option value="user">Пользователи</option>
        </select>
      </div>

      {loading && <div className="users-admin-loading">Загрузка...</div>}
      {error && <div className="users-admin-error">{error}</div>}
      {!loading && !error && users.length === 0 && (
        <div className="users-admin-empty">Пользователи не найдены</div>
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <div className="users-admin-grid">
            {users.map((user, idx) => (
              <div key={user.id} className="user-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="user-card-header">
                  <div className="user-card-avatar">{getInitials(user.name)}</div>
                  <div className="user-card-info">
                    <h3 className="user-card-name">{user.name}</h3>
                    <p className="user-card-login">@{user.login}</p>
                  </div>
                </div>
                <div className="user-card-meta">
                  <span className={`user-card-role user-card-role--${user.role}`}>
                    {user.role === 'admin' ? <FiShield size={12} /> : <FiUser size={12} />}
                    {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                  </span>
                  <span className="user-card-date">{formatDate(user.created_at)}</span>
                </div>
                {user.email && <p className="user-card-email">{user.email}</p>}
                <div className="user-card-actions">
                  <button className="user-card-action-btn" onClick={() => openEditModal(user)} title="Редактировать">
                    <FiEdit2 size={14} /> Изменить
                  </button>
                  <button className="user-card-action-btn" onClick={() => openRoleModal(user)} title="Сменить роль">
                    <FiShield size={14} /> Роль
                  </button>
                  {user.id !== currentUser.id && (
                    <button className="user-card-action-btn user-card-action-btn--danger" onClick={() => openDeleteModal(user)} title="Удалить">
                      <FiTrash2 size={14} /> Удалить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="users-admin-pagination">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} aria-label="Предыдущая страница">
                <FiChevronLeft size={16} />
              </button>
              <span>{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} aria-label="Следующая страница">
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="users-admin-modal-overlay" onClick={closeModal}>
          <div className="users-admin-modal" onClick={(e) => e.stopPropagation()}>
            {modalMode === 'create' && <h2>Новый пользователь</h2>}
            {modalMode === 'edit' && <h2>Редактировать</h2>}
            {modalMode === 'delete' && <h2>Удалить пользователя?</h2>}
            {modalMode === 'role' && <h2>Сменить роль</h2>}

            {modalMode === 'delete' ? (
              <p>Вы уверены, что хотите удалить пользователя <strong>{selectedUser?.name}</strong>? Это действие нельзя отменить.</p>
            ) : modalMode === 'role' ? (
              <>
                <p>Сменить роль пользователя <strong>{selectedUser?.name}</strong> на:</p>
                <div className="users-admin-modal-field">
                  <select
                    value={formData.role}
                    aria-label="Роль пользователя"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="users-admin-modal-field">
                  <label htmlFor="user-name">Имя</label>
                  <input id="user-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="users-admin-modal-field">
                  <label htmlFor="user-login">Логин</label>
                  <input id="user-login" value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} />
                </div>
                <div className="users-admin-modal-field">
                  <label htmlFor="user-email">Email</label>
                  <input id="user-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="users-admin-modal-field">
                  <label htmlFor="user-password">{modalMode === 'edit' ? 'Новый пароль (оставьте пустым)' : 'Пароль'}</label>
                  <input id="user-password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <div className="users-admin-modal-field">
                  <label htmlFor="user-role">Роль</label>
                  <select id="user-role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}>
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>
              </>
            )}

            <div className="users-admin-modal-actions">
              <button className="users-admin-modal-btn users-admin-modal-btn--secondary" onClick={closeModal}>
                Отмена
              </button>
              <button
                className={`users-admin-modal-btn ${modalMode === 'delete' ? 'users-admin-modal-btn--danger' : 'users-admin-modal-btn--primary'}`}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Загрузка...' : modalMode === 'delete' ? 'Удалить' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdminPage;
