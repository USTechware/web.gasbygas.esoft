import { ReactNode, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/data';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {


    const { replace: navigate } = useRouter();

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/auth/login')
        }
    }, [isLoggedIn, navigate])

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <Header />
                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}