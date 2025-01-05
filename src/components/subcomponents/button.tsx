'use client';

import React from 'react';
import classNames from 'classnames';

interface IButtonProps {
  text: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary'; // Only primary and secondary colors
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'gradient';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean; // New prop for loading state
}

const Button: React.FC<IButtonProps> = ({
  text,
  onClick,
  color = 'primary',
  size = 'sm',
  variant = 'solid',
  className = '',
  disabled = false,
  type = 'button',
  isLoading = false,
}) => {
  // Base button styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300';

  // Color and variant styles (Only primary and secondary colors)
  const colorVariants = {
    primary: {
      solid: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      outline: 'border border-blue-600 text-blue-600 hover:bg-blue-100 focus:ring-blue-500',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 focus:ring-blue-500',
    },
    secondary: {
      solid: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-600 text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
      gradient: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 focus:ring-gray-500',
    },
  };

  // Size styles
  const sizeVariants = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Apply all classes conditionally using classnames
  const buttonClasses = classNames(
    baseStyles,
    colorVariants[color][variant], // Apply color and variant
    sizeVariants[size], // Apply size
    {
      'opacity-50 cursor-not-allowed': disabled, // Handle disabled state
    },
    className // Any additional custom class passed in
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <svg
            role="status"
            className="w-5 h-5 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 101"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M100 50c0-27.614-22.386-50-50-50S0 22.386 0 50s22.386 50 50 50 50-22.386 50-50z"
              fill="currentColor"
            />
          </svg>
          Please wait
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
