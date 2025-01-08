// components/TextArea.tsx
import React, { TextareaHTMLAttributes } from 'react';
import classNames from 'classnames';

interface ITextAreaProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    rows?: number;
    cols?: number;
    className?: string;
}

const TextArea: React.FC<ITextAreaProps & TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
    id,
    label,
    value,
    onChange,
    placeholder = '',
    disabled = false,
    error = '',
    rows = 4,
    cols = 50,
    className = '',
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
            <textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                cols={cols}
                className={classNames(
                    'px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-300',
                    {
                        'bg-gray-200 cursor-not-allowed': disabled,
                        'border-gray-300': !error && !disabled,
                        'border-red-500 ring-2 ring-red-500': error,
                        'focus:ring-blue-500': !error && !disabled,
                    }
                )}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default TextArea;
