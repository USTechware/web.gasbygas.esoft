import React from 'react'
import { Menu } from 'lucide-react';
import DropdownMenu from '../subcomponents/dropdown';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/data';

function Header() {
    const dispatch = useDispatch<Dispatch>()

    const onLogout = () => {
        dispatch.auth.logout()
    }
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center gap-4">
                <DropdownMenu
                    buttonText={<Menu className="w-6 h-6" />}
                    items={[
                        { label: 'Logout', onClick: onLogout }
                    ]}
                />
            </div>
        </header>
    )
}

export default Header