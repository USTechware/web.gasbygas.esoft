'use client';

import { RootState } from '@/data';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Logo from '../logo';

interface AuthLayoutProps {
    children: ReactNode;
    showLogo?: boolean;
    title?: string;
}

export default function AuthLayout({
    children,
    showLogo = true,
    title = 'Welcome back'
}: AuthLayoutProps) {
    const { replace: navigate } = useRouter();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard')
        }
    }, [isLoggedIn, navigate])

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {showLogo && (
                    <Logo />
                )}
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
                    <div className="dark:text-gray-100">
                        {children}
                    </div>
                </div>
                <div className='flex justify-center p-2 mt-10'>
                    <span className='text-sm text-gray-300'>Powered by Esoft ASE Group(4)</span>
                </div>
            </div>
        </div>
    );
}