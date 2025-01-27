import React, { useMemo } from 'react'
import { Menu } from 'lucide-react';
import DropdownMenu from '../subcomponents/dropdown';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/data';
import useUser from '@/hooks/useUser';

function Header() {
    const dispatch = useDispatch<Dispatch>()
    const { isAdmin, isOutletManager, isBusiness, user } = useUser();

    const onLogout = () => {
        dispatch.auth.logout()
    }

    const header = useMemo(() => {
        if (isAdmin) return "Admin"
        if (isOutletManager) {
            return  `${(user?.outlet as any)?.name} [Outlet]`
        }
        return isBusiness ? 'Business': 'Customer'
    }, [isAdmin, isOutletManager, isBusiness])
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className='flex'>
                <div className='mr-4 font-bold py-1 hidden sm:block'>
                    {header}
                </div>
                <div className="flex items-center gap-4">
                    <DropdownMenu
                        buttonText={<Menu className="w-6 h-6" />}
                        items={[
                            { label: 'Profile', onClick: () => window.location.href = "/settings/profile" },
                            { label: 'Change Password', onClick: () => window.location.href = "/settings/change-password" },
                            { label: 'Logout', onClick: onLogout }
                        ]}
                    />
                </div>
            </div>
        </header>
    )
}

export default Header