import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiLogOut, FiMenu, FiX, FiBookOpen, FiSettings } from 'react-icons/fi';
import { RootState } from '@store/store';
import { clearCredentials } from '@store/authSlice';
import type { AppDispatch } from '@store/store';
import { authApi } from '@api/authApi';
import Button from '@/components/ui/Button/Button';
import './Header.css';

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/profile" className="header-logo" onClick={closeMenus}>
          <img
            src="/src/style/svg/cursor-i2.svg"
            alt="Inseptum"
            className="header-logo-icon"
          />
          <span className="header-logo-text">Inseptum</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <Link to="/articles" className={`header-nav-link${location.pathname === '/articles' ? ' header-nav-link--active' : ''}`}>
            <FiBookOpen size={18} />
            <span>Статьи</span>
          </Link>
          <Link to="/profile" className={`header-nav-link${location.pathname === '/profile' ? ' header-nav-link--active' : ''}`}>
            <FiUser size={18} />
            <span>Профиль</span>
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="header-nav-link header-nav-link--admin">
              <FiSettings size={18} />
              <span>Админ панель</span>
            </Link>
          )}
        </nav>

        {/* User Menu (Desktop) */}
        {isAuthenticated && user && (
          <div className="header-user">
            <button
              className="header-user-btn"
              onClick={toggleUserMenu}
              aria-expanded={isUserMenuOpen}
            >
              <div className="header-user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="header-user-name">{user.name}</span>
            </button>

            {isUserMenuOpen && (
              <div className="header-user-menu">
                <div className="header-user-menu-header">
                  <span className="header-user-menu-name">{user.name}</span>
                  <span className="header-user-menu-email">{user.email}</span>
                </div>
                <div className="header-user-menu-divider" />
                <button 
                  className="header-user-menu-item"
                  onClick={() => {
                    closeMenus();
                    handleLogout();
                  }}
                >
                  <FiLogOut size={16} />
                  <span>Выйти</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="header-mobile-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="header-mobile-menu">
          <nav className="header-mobile-nav">
            <Link
              to="/articles"
              className={`header-mobile-nav-link${location.pathname === '/articles' ? ' header-mobile-nav-link--active' : ''}`}
              onClick={closeMenus}
            >
              <FiBookOpen size={20} />
              <span>Статьи</span>
            </Link>
            <Link
              to="/profile"
              className={`header-mobile-nav-link${location.pathname === '/profile' ? ' header-mobile-nav-link--active' : ''}`}
              onClick={closeMenus}
            >
              <FiUser size={20} />
              <span>Профиль</span>
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="header-mobile-nav-link header-mobile-nav-link--admin"
                onClick={closeMenus}
              >
                <FiSettings size={20} />
                <span>Админ панель</span>
              </Link>
            )}
          </nav>

          {isAuthenticated && user && (
            <div className="header-mobile-user">
              <div className="header-mobile-user-info">
                <div className="header-user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="header-mobile-user-name">{user.name}</span>
                  <span className="header-mobile-user-email">{user.email}</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                leftIcon={<FiLogOut size={16} />}
                onClick={() => {
                  closeMenus();
                  handleLogout();
                }}
              >
                Выйти
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close menus */}
      {isUserMenuOpen && (
        <div 
          className="header-overlay" 
          onClick={() => setIsUserMenuOpen(false)} 
          aria-hidden="true" 
        />
      )}
    </header>
  );
};

export default Header;