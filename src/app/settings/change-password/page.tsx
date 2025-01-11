'use client';

import AuthRoleCheck from '@/components/Auth';
import AppLayout from '@/components/layouts/AppLayout';
import Input from '@/components/subcomponents/input';
import Button from '@/components/subcomponents/button';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/data';
import { toast } from 'react-toastify';
import { UserRole } from '@/app/api/types/user';
import { useRouter } from 'next/navigation';
import useUser from '@/hooks/useUser';

function ChangePassword() {
    const dispatch = useDispatch<Dispatch>();

    const { user } = useUser();

    const router = useRouter()

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChangeField = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validateForm = () => {
        const errors = { currentPassword: '', newPassword: '', confirmPassword: '' };
        let isValid = true;

        if (!formData.currentPassword) {
            errors.currentPassword = 'Current password is required';
            isValid = false;
        }
        if (!formData.newPassword || formData.newPassword.length < 6) {
            errors.newPassword = 'New password must be at least 6 characters';
            isValid = false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const data: any = await dispatch.auth.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            toast.success(data?.message || 'Password changed successfully');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            router.push('/dashboard')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to change password');
            console.log('Change password failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200">Change Password</h1>
                {
                    user?.requestChangePassword && (
                        <div className="my-2 bg-orange-100 border border-orange-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Warning: </strong>
                            <span className="block sm:inline">Your password is outdated/required to update. Please update it immediately to secure your account.</span>
                        </div>
                    )
                }

                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <div className="mb-4">
                        <Input
                            id="currentPassword"
                            type="password"
                            error={formErrors.currentPassword}
                            value={formData.currentPassword}
                            label="Current Password"
                            onChange={handleChangeField.bind(null, 'currentPassword')}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            id="newPassword"
                            type="password"
                            error={formErrors.newPassword}
                            value={formData.newPassword}
                            label="New Password"
                            onChange={handleChangeField.bind(null, 'newPassword')}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            id="confirmPassword"
                            type="password"
                            error={formErrors.confirmPassword}
                            value={formData.confirmPassword}
                            label="Confirm Password"
                            onChange={handleChangeField.bind(null, 'confirmPassword')}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            isLoading={isLoading}
                            text="Change Password"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default AuthRoleCheck(ChangePassword, { roles: [] });
