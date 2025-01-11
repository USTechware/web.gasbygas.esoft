import { ReactNode, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/data';
import useUser from '@/hooks/useUser';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {

    const dispatch = useDispatch()
    const { replace: navigate } = useRouter();

    const { isLoggedIn, user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        dispatch.auth.fetchUser();
    }, [])

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/login')
        } else {
            if (user && user.requestChangePassword) {
                navigate('/settings/change-password')
            }
        }
    }, [isLoggedIn, navigate, user])

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {/* Header */}
                <Header />
                {/* Page Content */}
                <main className="p-6 overflow-x-scroll">
                    {children}
                </main>
            </div>
        </div>
    );
}