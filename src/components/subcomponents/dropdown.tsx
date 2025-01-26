import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

interface DropdownMenuItem {
    label: string;
    onClick: (item?: any) => void;
}

interface DropdownMenuProps {
    items: DropdownMenuItem[];
    buttonText: string | React.ReactNode;
    buttonClassName?: string;
    menuClassName?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    items,
    buttonText,
    buttonClassName = '',
    menuClassName = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {
                items.length > 0 &&
                <div
                    className='cursor-pointer'
                    onClick={toggleMenu}
                >
                    {buttonText}
                </div>
            }

            {isOpen && (
                <div
                    className={classNames(
                        'fixed z-10 mb-0 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600',
                        menuClassName
                    )}
                >
                    <ul className="py-1">
                        {items.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    item.onClick()
                                    setIsOpen(false)
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
