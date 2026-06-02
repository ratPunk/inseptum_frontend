import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import Divider from '@/components/ui/Divider/Divider';
import { authApi } from '@api/authApi';
import { setCredentials } from '@store/authSlice';
import type { AppDispatch } from '@store/store';
import logoSvg from '@/style/svg/cursor-i2.svg';
import './AuthForm.css';

/* ─── Types ─── */
type AuthMode = 'login' | 'register';

interface LoginFields {
  login: string;
  password: string;
}

interface RegisterFields {
  name: string;
  login: string;
  password: string;
  confirmPassword: string;
}

type FieldErrors<T> = Partial<Record<keyof T, string>>;

/* ─── Validation ─── */
const validatePassword = (v: string) =>
  v.length >= 6 ? '' : 'Минимум 6 символов';

const validateName = (v: string) =>
  v.trim().length >= 2 ? '' : 'Минимум 2 символа';

/* ─── Axios error helper ─── */
function extractApiError(err: unknown): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    (err as { response?: { data?: { error?: string } } }).response?.data?.error
  ) {
    return (err as { response: { data: { error: string } } }).response.data.error;
  }
  return 'Произошла ошибка. Попробуйте ещё раз.';
}

/* ─── Component ─── */
const AuthForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('login');
  const [animating, setAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  /* Login state */
    const [loginFields, setLoginFields] = useState<LoginFields>({ login: '', password: '' });
    const [loginErrors, setLoginErrors] = useState<FieldErrors<LoginFields>>({});

  /* Register state */
  const [regFields, setRegFields] = useState<RegisterFields>({
    name: '',
    login: '',
    password: '',
    confirmPassword: '',
  });
  const [regErrors, setRegErrors] = useState<FieldErrors<RegisterFields>>({});

  /* ── Mode switch with animation ── */
  const switchMode = useCallback((next: AuthMode) => {
    if (next === mode || animating) return;
    setAnimating(true);
    setSuccess(false);
    setServerError('');
    setTimeout(() => {
      setMode(next);
      setLoginErrors({});
      setRegErrors({});
      setShowPassword(false);
      setShowConfirm(false);
      setAnimating(false);
    }, 320);
  }, [mode, animating]);

  /* ── Login submit ── */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    const errors: FieldErrors<LoginFields> = {
      login: loginFields.login.trim().length >= 2 ? '' : 'Минимум 2 символа',
      password: validatePassword(loginFields.password),
    };
    const hasErrors = Object.values(errors).some(Boolean);
    setLoginErrors(errors);
    if (hasErrors) return;

    setLoading(true);
    try {
      const data = await authApi.login({
        login: loginFields.login.trim(),
        password: loginFields.password,
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate('/profile');
    } catch (err) {
      setServerError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ── Register submit ── */
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    const errors: FieldErrors<RegisterFields> = {
      name: validateName(regFields.name),
      login: regFields.login.trim().length >= 2 ? '' : 'Минимум 2 символа',
      password: validatePassword(regFields.password),
      confirmPassword:
        regFields.confirmPassword === regFields.password ? '' : 'Пароли не совпадают',
    };
    const hasErrors = Object.values(errors).some(Boolean);
    setRegErrors(errors);
    if (hasErrors) return;

    setLoading(true);
    try {
      const data = await authApi.register({
        name: regFields.name.trim(),
        login: regFields.login.trim(),
        password: regFields.password,
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate('/profile');
    } catch (err) {
      setServerError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="auth-page">
      {/* Ambient background orbs */}
      <div className="auth-orb auth-orb--blue" aria-hidden="true" />
      <div className="auth-orb auth-orb--orange" aria-hidden="true" />
      <div className="auth-orb auth-orb--accent" aria-hidden="true" />

      <div className="auth-card" role="main">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon" aria-hidden="true">
            <img src={logoSvg} alt="Inseptum logo" width="28" height="28" />
          </div>
          <span className="auth-brand-name">Inseptum</span>
        </div>

        {/* Form panel */}
        <div className={`auth-panel ${animating ? 'auth-panel--exit' : 'auth-panel--enter'}`}>
          {success ? (
            <div className="auth-success" role="status" aria-live="polite">
              <div className="auth-success-icon" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <p className="auth-success-title">
                {mode === 'login' ? 'Добро пожаловать!' : 'Аккаунт создан!'}
              </p>
              <p className="auth-success-sub">
                {mode === 'login'
                  ? 'Вы успешно вошли в систему.'
                  : 'Регистрация прошла успешно.'}
              </p>
            </div>
          ) : mode === 'login' ? (
            /* ── LOGIN FORM ── */
            <form
              className="auth-form"
              onSubmit={handleLoginSubmit}
              noValidate
              aria-label="Форма входа"
            >
              <h1 className="auth-form-title">С возвращением</h1>
              <p className="auth-form-sub">Войдите в свой аккаунт</p>

              {serverError && (
                <p className="auth-server-error" role="alert">{serverError}</p>
              )}

              <div className="auth-fields">
                <Input
                  label="Логин"
                  type="text"
                  placeholder="your_login"
                  autoComplete="username"
                  leftIcon={<FiUser size={16} />}
                  value={loginFields.login}
                  onChange={e => setLoginFields(f => ({ ...f, login: e.target.value }))}
                  error={loginErrors.login}
                />
                <Input
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  leftIcon={<FiLock size={16} />}
                  rightIcon={showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  onRightIconClick={() => setShowPassword(v => !v)}
                  value={loginFields.password}
                  onChange={e => setLoginFields(f => ({ ...f, password: e.target.value }))}
                  error={loginErrors.password}
                />
              </div>

              <div className="auth-forgot">
                <button type="button" className="auth-link">
                  Забыли пароль?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Войти
              </Button>

              <Divider label="или" />

              <p className="auth-switch-text">
                Нет аккаунта?{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => switchMode('register')}
                >
                  Зарегистрироваться
                </button>
              </p>
            </form>
          ) : (
            /* ── REGISTER FORM ── */
            <form
              className="auth-form"
              onSubmit={handleRegisterSubmit}
              noValidate
              aria-label="Форма регистрации"
            >
              <h1 className="auth-form-title">Создать аккаунт</h1>
              <p className="auth-form-sub">Присоединяйтесь к Inseptum</p>

              {serverError && (
                <p className="auth-server-error" role="alert">{serverError}</p>
              )}

              <div className="auth-fields">
                <Input
                  label="Имя"
                  type="text"
                  placeholder="Иван Иванов"
                  autoComplete="name"
                  leftIcon={<FiUser size={16} />}
                  value={regFields.name}
                  onChange={e => setRegFields(f => ({ ...f, name: e.target.value }))}
                  error={regErrors.name}
                />
                <Input
                  label="Логин"
                  type="text"
                  placeholder="your_login"
                  autoComplete="username"
                  leftIcon={<FiUser size={16} />}
                  value={regFields.login}
                  onChange={e => setRegFields(f => ({ ...f, login: e.target.value }))}
                  error={regErrors.login}
                />
                <Input
                  label="Пароль"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  leftIcon={<FiLock size={16} />}
                  rightIcon={showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  onRightIconClick={() => setShowPassword(v => !v)}
                  value={regFields.password}
                  onChange={e => setRegFields(f => ({ ...f, password: e.target.value }))}
                  error={regErrors.password}
                  hint="Минимум 6 символов"
                />
                <Input
                  label="Подтвердите пароль"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  leftIcon={<FiLock size={16} />}
                  rightIcon={showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  onRightIconClick={() => setShowConfirm(v => !v)}
                  value={regFields.confirmPassword}
                  onChange={e => setRegFields(f => ({ ...f, confirmPassword: e.target.value }))}
                  error={regErrors.confirmPassword}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Создать аккаунт
              </Button>

              <Divider label="или" />

              <p className="auth-switch-text">
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => switchMode('login')}
                >
                  Войти
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
