import React, { forwardRef } from 'react';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
    children,
    className = '',
    padding = 'md',
    ...props
}, ref) => {
    const paddingClasses = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6'
    };

    return (
        <div
            ref={ref}
            className={`
          ${paddingClasses[padding]}
          ${className}
        `}
            {...props}
        >
            {children}
        </div>
    );
});
