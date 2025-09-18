import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helper?: string;
}

export const Input: React.FC<InputProps> = ({
  error,
  label,
  helper,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={cn(
          'input',
          error && 'input-error',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="form-error">{error}</p>
      )}
      
      {helper && !error && (
        <p className="form-help">{helper}</p>
      )}
    </div>
  );
};

export default Input;
