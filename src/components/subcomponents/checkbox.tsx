// components/CheckBox.tsx
import React from 'react';
import classNames from 'classnames';

interface ICheckBoxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const CheckBox: React.FC<ICheckBoxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      htmlFor={id}
      className={classNames(
        'inline-flex items-center space-x-2 cursor-pointer select-none',
        className
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={classNames(
          'form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 transition duration-300',
          {
            'cursor-not-allowed opacity-50': disabled,
          }
        )}
      />
      <span
        className={classNames('text-sm font-medium', {
          'text-gray-400': disabled,
          'text-gray-900': !disabled,
        })}
      >
        {label}
      </span>
    </label>
  );
};

export default CheckBox;
