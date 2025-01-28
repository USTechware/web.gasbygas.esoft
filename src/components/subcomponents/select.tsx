'use client';

import React, { useState } from 'react';
import classNames from 'classnames';

interface SelectProps {
  name?: string;
  label: string;
  options: { label: string; value: string }[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  disabled = false,
  error,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState((value ? options.find(o => o.value === value)?.label : '') || '');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectClasses = classNames(
    'block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
    {
      'bg-gray-100 text-gray-500 cursor-not-allowed': disabled,
      'border-gray-300 text-gray-700': !error && !disabled,
      'border-red-500 text-red-500': error,
    },
    className
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </label>

      {/* Search input */}
      <input
        type="text"
        className={selectClasses}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow for click
        placeholder="Search..."
        disabled={disabled}
      />

      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto z-10">
          <ul>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    onChange(option.value);
                    setSearchQuery(option.label);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
