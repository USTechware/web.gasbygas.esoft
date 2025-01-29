import React, { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className = '',
  shadow = 'md',
  border = true,
  radius = 'md',
  ...props
}, ref) => {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg'
  };

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <div
      ref={ref}
      className={`
        bg-white 
        ${border ? 'border border-gray-200' : ''} 
        ${shadowClasses[shadow]}
        ${radiusClasses[radius]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});