import React, { forwardRef, useState, useId } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconClick,
      id,
      className = '',
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const generatedId = useId();
    const inputId = id ?? `input-${generatedId}`;
    const errorProps = error
      ? { 'aria-invalid': 'true' as const, 'aria-describedby': `${inputId}-error` }
      : hint
        ? { 'aria-describedby': `${inputId}-hint` }
        : {};

    return (
      <div className={`ui-input-wrapper ${error ? 'ui-input-wrapper--error' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="ui-input-label">
            {label}
          </label>
        )}
        <div className={`ui-input-field ${focused ? 'ui-input-field--focused' : ''} ${error ? 'ui-input-field--error' : ''}`}>
          {leftIcon && <span className="ui-input-icon ui-input-icon--left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className="ui-input-element"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...errorProps}
            {...rest}
          />
          {rightIcon && (
            <button
              type="button"
              className="ui-input-icon ui-input-icon--right ui-input-icon--btn"
              onClick={onRightIconClick}
              tabIndex={-1}
              aria-label="Toggle input action"
            >
              {rightIcon}
            </button>
          )}
        </div>
        {error && (
          <span id={`${inputId}-error`} className="ui-input-message ui-input-message--error" role="alert">
            {error}
          </span>
        )}
        {!error && hint && (
          <span id={`${inputId}-hint`} className="ui-input-message ui-input-message--hint">
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
