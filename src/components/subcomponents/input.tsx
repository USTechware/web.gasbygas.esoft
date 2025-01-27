// components/Input.tsx
import React, { InputHTMLAttributes } from 'react';
import classNames from 'classnames';

interface IInputProps {
  id?: string;
  label: string;
  value: number | string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  type?: 'text' | 'password' | 'email' | 'date' | 'number' | 'tel';
  className?: string;
}

const Input: React.FC<IInputProps & InputHTMLAttributes<HTMLInputElement>> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error = '',
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className={classNames('flex flex-col space-y-2', className)}>
      <label
        htmlFor={id}
        className={classNames('text-sm font-medium', {
          'text-gray-400': disabled,
          'text-gray-700': !disabled,
        })}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value): () => {}}
        placeholder={placeholder}
        disabled={disabled}
        className={classNames(
          'px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-300',
          {
            'bg-gray-200 cursor-not-allowed': disabled,
            'border-gray-300': !error && !disabled,
            'border-red-500 ring-2 ring-red-500': error,
            'focus:ring-blue-500': !error && !disabled,
          }
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
