'use client';

import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Dispatch } from '@/data';
import Link from 'next/link';
import Button from '@/components/subcomponents/button';

export default function ForgotPasswordPage() {
    const dispatch = useDispatch<Dispatch>();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const validateEmail = () => {
        if (!email) {
            setError('Email is required');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateEmail()) {
            return;
        }

        setIsLoading(true);
        try {
            await dispatch.auth.forgotPassword({ email });
            setSuccessMessage('A password reset link has been sent to your email.');
        } catch (error) {
            console.error('Password reset failed:', error);
            setError('Failed to send password reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Forgot Password">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm 
                                dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                                ${error
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-500'
                                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400'
                                }`}
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        text={isLoading ? 'Sending...' : 'Send Reset Link'}
                    />
                </div>

                {successMessage && (
                    <p className="mt-4 text-sm text-green-600 dark:text-green-400 text-center">
                        {successMessage}
                    </p>
                )}

                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Remember your password?{' '}
                        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Sign in
                        </Link>
                    </span>
                </div>
            </form>
        </AuthLayout>
    );
}
