import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || loading;
  const loadingProps = loading ? { 'aria-busy': 'true' as const } : {};

  return (
    <button
      className={[
        'ui-btn',
        `ui-btn--${variant}`,
        `ui-btn--${size}`,
        fullWidth ? 'ui-btn--full' : '',
        loading ? 'ui-btn--loading' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      {...loadingProps}
      {...rest}
    >
      {loading && (
        <span className="ui-btn-spinner" aria-hidden="true">
          <span className="ui-btn-spinner-ring" />
        </span>
      )}
      {!loading && leftIcon && (
        <span className="ui-btn-icon ui-btn-icon--left" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span className="ui-btn-label">{children}</span>
      {!loading && rightIcon && (
        <span className="ui-btn-icon ui-btn-icon--right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
