'use client';

import { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import AuthLayout from '@/components/layouts/AuthLayout';
import Link from 'next/link';
import { Dispatch } from '@/data';
import Button from '@/components/subcomponents/button';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Select from '@/components/subcomponents/select';
import AreasList from '../../../../public/areas.json';
import Input from '@/components/subcomponents/input';

type UserType = 'CUSTOMER' | 'BUSINESS';

const DistrictsList = Object.keys(AreasList).map((d) => ({ label: d, value: d }));

const CitiesList = (district: string) => (
    ((AreasList as any)[district]?.cities || []).map((c: string) => ({ label: c, value: c }))
)


interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    nationalIdNumber: string;
    district: string;
    city: string;
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
        district: '',
        city: '',
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

    const handleChangeField = (field: string, val: any) => {
        setForm(prev => ({
            ...prev,
            [field]: val,
        }));
    };


    return (
        <AuthLayout title="Create your account">
            <form className="space-y-6" onSubmit={handleSubmit}>

                <div>
                    <Select label='Account Type' value={form.userRole}
                        onChange={handleChangeField.bind(null, 'userRole')}
                        options={[{ label: 'Individual', value: 'CUSTOMER' }, { label: 'Business', value: 'BUSINESS' }]} />
                </div>

                <div>
                    <Input id='' label='First Name' value={form.firstName}
                        error={errors.firstName} placeholder='First Name'
                        onChange={handleChangeField.bind(null, 'firstName')} />
                </div>

                <div>
                    <Input id='' label='Last Name' value={form.lastName}
                        error={errors.lastName} placeholder='Last Name'
                        onChange={handleChangeField.bind(null, 'lastName')} />
                </div>

                <div>
                    <Input id='' label='Email' value={form.email}
                        error={errors.email} placeholder='Email'
                        onChange={handleChangeField.bind(null, 'email')} />
                </div>
                <div>
                    <Input id='' label=' NIC Number' placeholder='NIC Number' value={form.nationalIdNumber}
                        error={errors.nationalIdNumber}
                        onChange={handleChangeField.bind(null, 'nationalIdNumber')} />
                </div>

                {form.userRole === 'BUSINESS' && (
                    <div>
                        <Input id='' label='Business Registration ID' placeholder='Business Registration ID' value={form.businessRegId || ''}
                            error={errors.businessRegId}
                            onChange={handleChangeField.bind(null, 'businessRegId')} />
                    </div>
                )}

                <div>
                    <Input id='' label='Phone Number' placeholder='Phone Number' value={form.phoneNumber || ''}
                        error={errors.phoneNumber}
                        onChange={handleChangeField.bind(null, 'phoneNumber')} />
                </div>
                <div className='mb-2'>
                    <Select label='District' value={form.district}
                        options={DistrictsList}
                        onChange={handleChangeField.bind(null, 'district')}
                        error={errors.district}
                    />
                </div>

                <div className='mb-2'>
                    <Select label='City' value={form.city || ''}
                        options={CitiesList(form.district)}
                        onChange={handleChangeField.bind(null, 'city')}
                        error={errors.city}
                    />
                </div>
                <div>
                    <Input id='' label='Address'
                        placeholder='Address'
                        value={form.address || ''}
                        error={errors.address}
                        onChange={handleChangeField.bind(null, 'address')} />
                </div>

                <div>
                    <Input id=''
                        placeholder='Password'
                        type='password'
                        label='Password' value={form.password || ''}
                        error={errors.password}
                        onChange={handleChangeField.bind(null, 'password')} />
                </div>

                <div>
                    <Input id=''
                        type='password'
                        placeholder='Confirm Password'
                        label='Confirm Password' value={form.confirmPassword || ''}
                        error={errors.confirmPassword}
                        onChange={handleChangeField.bind(null, 'confirmPassword')} />
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
        </AuthLayout >
    );
}