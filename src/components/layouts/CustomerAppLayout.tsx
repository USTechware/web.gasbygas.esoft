import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data';
import { Bell, Menu } from 'lucide-react';
import DropdownMenu from '../subcomponents/dropdown';
import Logo from '../logo';
import { UserRole } from '@/app/api/types/user';
import { BusinessVerifcationStatus } from '@/constants/common';
import BusinessVerificationBanner from '../status/BusinessVerficationBanner';

interface CustomerAppLayoutProps {
    children: ReactNode;
}

export default function CustomerAppLayout({ children }: CustomerAppLayoutProps) {
    const dispatch = useDispatch();
    const { replace: navigate } = useRouter();
    const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch.auth.fetchUser();
    }, []);

    const onLogout = () => {
        dispatch.auth.logout()
    }

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/login');
        } else if (user?.requestChangePassword) {
            navigate('/settings/change-password');
        }
    }, [isLoggedIn, navigate, user]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Logo />
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden sm:flex sm:space-x-8">
                            <a href="/dashboard" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">
                                Dashboard
                            </a>
                            <a href="/requests" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">
                                Requests
                            </a>
                            <a href="/settings/profile" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">
                                Profile
                            </a>
                            <a href="/auth/login" onClick={onLogout} className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">
                                Logout
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            {
                                user?.userRole === UserRole.BUSINESS &&
                                <div>
                                    <div className='text-sm font-bold'>{user.company}</div>
                                    <div className='text-xs text-gray-400'>Business</div>
                                </div>
                            }
                            <a href="/notifications" className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100">
                                <Bell className="h-5 w-5" />
                            </a>
                            <DropdownMenu
                                buttonText={<Menu className="w-6 h-6" />}
                                items={[
                                    { label: 'Dashboard', onClick: () => window.location.href = "/dashboard" },
                                    { label: 'Requests', onClick: () => window.location.href = "/requests" },
                                    { label: 'Profile', onClick: () => window.location.href = "/settings/profile" },
                                    { label: 'Change Password', onClick: () => window.location.href = "/settings/change-password" },
                                    { label: 'Logout', onClick: onLogout }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </nav>
            {/* Page Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mt-2">
                    {
                        user?.userRole === UserRole.BUSINESS &&
                        <BusinessVerificationBanner status={user.businessVerificationStatus as BusinessVerifcationStatus} />
                    }
                    {children}
                </div>
            </main>

            {/* Page Footer */}
            <footer className="bg-white shadow-sm mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Your GasByGas Pvt Ltd. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="/privacy" className="text-sm text-gray-500 hover:text-primary">Privacy Policy</a>
                            <a href="/terms-and-conditions" className="text-sm text-gray-500 hover:text-primary">Terms of Service</a>
                            <a href="/contact" className="text-sm text-gray-500 hover:text-primary">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}