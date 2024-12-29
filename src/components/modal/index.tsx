'use client';

import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> & {
    Header: React.FC<{ children: ReactNode }>;
    Content: React.FC<{ children: ReactNode }>;
    Footer: React.FC<{ children: ReactNode }>;
  } = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full">
                <div className="absolute top-0 right-0 p-4">
                    <button
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
                        onClick={onClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

Modal.Header = ({ children }: { children: ReactNode }) => (
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{children}</h3>
    </div>
);

Modal.Content = ({ children }: { children: ReactNode }) => (
    <div className="px-6 py-4 text-gray-700 dark:text-gray-300">{children}</div>
);

Modal.Footer = ({ children }: { children: ReactNode }) => (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
        {children}
    </div>
);

export default Modal;
