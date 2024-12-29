'use client';

import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import AuthLayout from '@/components/layouts/AuthLayout';
import Link from 'next/link';
import { Dispatch } from '@/data';
import Button from '@/components/subcomponents/button';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

type UserType = 'CUSTOMER' | 'BUSINESS';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    nationalIdNumber: string;
    address: string;
    phoneNumber: string;
    userRole: UserType;
    businessRegId?: string;
}

export default function RegisterPage() {
    const dispatch = useDispatch<Dispatch>();
    const router = useRouter();
    const [form, setForm] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        nationalIdNumber: '',
        address: '',
        phoneNumber: '',
        userRole: 'CUSTOMER'
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let isValid = true;
        const newErrors: Partial<FormData> = {};

        // Email validation
        if (!form.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        // Password validation
        if (!form.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Confirm password
        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        // NIC validation
        if (!form.nationalIdNumber) {
            newErrors.nationalIdNumber = 'NIC is required';
            isValid = false;
        }

        // Phone validation
        if (!form.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(form.phoneNumber.replace(/[^\d]/g, ''))) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
            isValid = false;
        }

        // Address validation
        if (!form.address) {
            newErrors.address = 'Address is required';
            isValid = false;
        }

        // Business registration validation
        if (form.userRole === 'BUSINESS' && !form.businessRegId) {
            newErrors.businessRegId = 'Business Registration ID is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await dispatch.auth.register(form);
            toast.success("You've signed up successfully")
            router.push('/auth/login')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unknown error occurred!")
            console.log('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const inputClassName = (error?: string) => `
        block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm 
        dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
        ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-400'
        }
    `;

    return (
        <AuthLayout title="Create your account">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Account Type
                    </label>
                    <select
                        id="userRole"
                        name="userRole"
                        value={form.userRole}
                        onChange={handleChange}
                        className={inputClassName()}
                    >
                        <option value="CUSTOMER">Individual</option>
                        <option value="BUSINESS">Business</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        First Name
                    </label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={form.firstName}
                        onChange={handleChange}
                        className={inputClassName(errors.firstName)}
                    />
                    {errors.firstName && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Last Name
                    </label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={form.lastName}
                        onChange={handleChange}
                        className={inputClassName(errors.lastName)}
                    />
                    {errors.lastName && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className={inputClassName(errors.email)}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="nic" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        NIC Number
                    </label>
                    <input
                        id="nationalIdNumber"
                        name="nationalIdNumber"
                        type="text"
                        required
                        value={form.nationalIdNumber}
                        onChange={handleChange}
                        className={inputClassName(errors.nationalIdNumber)}
                    />
                    {errors.nationalIdNumber && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.nationalIdNumber}</p>
                    )}
                </div>

                {form.userRole === 'BUSINESS' && (
                    <div>
                        <label htmlFor="businessRegId" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Business Registration ID
                        </label>
                        <input
                            id="businessRegId"
                            name="businessRegId"
                            type="text"
                            required
                            value={form.businessRegId}
                            onChange={handleChange}
                            className={inputClassName(errors.businessRegId)}
                        />
                        {errors.businessRegId && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.businessRegId}</p>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Phone Number
                    </label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className={inputClassName(errors.phoneNumber)}
                    />
                    {errors.phoneNumber && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        required
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        className={inputClassName(errors.address)}
                    />
                    {errors.address && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={form.password}
                        onChange={handleChange}
                        className={inputClassName(errors.password)}
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={inputClassName(errors.confirmPassword)}
                    />
                    {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                    )}
                </div>

                <div>
                    <Button
                        type="submit"
                        text={isLoading ? 'Creating account...' : 'Create account'}
                        disabled={isLoading}
                    />

                </div>

                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Sign in
                        </Link>
                    </span>
                </div>
            </form>
        </AuthLayout>
    );
}