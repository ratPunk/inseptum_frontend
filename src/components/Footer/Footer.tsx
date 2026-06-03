import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-brand">
          <Link to="/profile" className="footer-logo">
            <img
              src="/src/style/svg/cursor-i2.svg"
              alt="Inseptum"
              className="footer-logo-icon"
            />
            <span className="footer-logo-text">Inseptum</span>
          </Link>
          <p className="footer-tagline">
            Платформа для обучения и развития навыков программирования
          </p>
        </div>

        {/* Navigation Links */}
        <div className="footer-nav">
          <h3 className="footer-nav-title">Навигация</h3>
          <nav className="footer-nav-list">
            <Link to="/profile" className="footer-nav-link">Главная</Link>
            <Link to="/articles" className="footer-nav-link">Статьи</Link>
            <Link to="/profile" className="footer-nav-link">Профиль</Link>
          </nav>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3 className="footer-nav-title">Информация</h3>
          <nav className="footer-nav-list">
            <a href="#" className="footer-nav-link">О проекте</a>
            <a href="#" className="footer-nav-link">Контакты</a>
            <a href="#" className="footer-nav-link">Политика конфиденциальности</a>
            <a href="#" className="footer-nav-link">Условия использования</a>
          </nav>
        </div>

        {/* Social Links */}
        <div className="footer-social">
          <h3 className="footer-nav-title">Мы в соцсетях</h3>
          <div className="footer-social-icons">
            <a 
              href="#" 
              className="footer-social-link" 
              aria-label="Telegram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src="/src/style/images/telegramIcon.webp" 
                alt="Telegram" 
                className="footer-social-icon"
              />
            </a>
            <a 
              href="#" 
              className="footer-social-link" 
              aria-label="VK"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src="/src/style/images/vkIcon.webp" 
                alt="VK" 
                className="footer-social-icon"
              />
            </a>
            <a 
              href="#" 
              className="footer-social-link" 
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src="/src/style/images/youtubeIcon.webp" 
                alt="YouTube" 
                className="footer-social-icon"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            © {currentYear} Inseptum. Все права защищены.
          </p>
          <p className="footer-made">
            Создано с использованием React + TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;