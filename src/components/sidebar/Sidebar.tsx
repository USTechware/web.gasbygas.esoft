import React, { ReactNode, useEffect, useState } from 'react'
import { Menu, ChevronLeft, ChevronRight, Building, CalculatorIcon, ListChecks, TrainIcon, BookCheck, LayoutDashboardIcon } from 'lucide-react';
import Logo from '../logo';
import { useSelector } from 'react-redux';
import { RootState } from '@/data';
import { UserRole } from '@/app/api/types/user';
import useUser from '@/hooks/useUser';

interface NavItem {
    name: string;
    href: string;
    icon: ReactNode;
}



export default function Sidebar() {

    const [navigation, setNavigation] = useState<NavItem[]>([
        { name: 'Dashboard', href: '/dashboard', icon: <Menu className="w-6 h-6" /> },
        { name: 'Projects', href: '/projects', icon: <Menu className="w-6 h-6" /> },
        { name: 'Tasks', href: '/tasks', icon: <Menu className="w-6 h-6" /> }
    ]);

    const { isAdmin, isOutletManager } = useUser();

    useEffect(() => {
        let menu: NavItem[] = [
            { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboardIcon className="w-6 h-6" /> },
        ]

        if (isAdmin) {
            menu.push(
                { name: 'Outlets', href: '/outlets', icon: <Building className="w-6 h-6" /> },
                { name: 'Inventory', href: '/inventory', icon: <CalculatorIcon className="w-6 h-6" /> },
                { name: 'Deliveries', href: '/deliveries', icon: <TrainIcon className="w-6 h-6" /> },
            )
        } else if (isOutletManager) {
            menu.push(
                { name: 'Requests', href: '/requests', icon: <ListChecks className="w-6 h-6" /> },
                { name: 'Deliveries', href: '/deliveries', icon: <TrainIcon className="w-6 h-6" /> },
                { name: 'Stocks', href: '/stocks', icon: <BookCheck className="w-6 h-6" /> },
            )
        } else {
            menu.push(
                { name: 'Requests', href: '/requests', icon: <ListChecks className="w-6 h-6" /> }
            )
        }

        setNavigation([...menu])

    }, [isAdmin, isOutletManager])

    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`bg-gray-800 text-white transition-all ${collapsed ? 'w-16' : 'min-w-[250px] w-[250px]'}`}>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4">
                {!collapsed && <Logo />}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-lg hover:bg-gray-700"
                >
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="mt-4">
                {navigation.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-2 hover:bg-gray-700"
                    >
                        <div className="flex items-center">
                            {item.icon}
                            {!collapsed && <span className="ml-3">{item.name}</span>}
                        </div>
                    </a>
                ))}
            </nav>
        </div>
    )
}
