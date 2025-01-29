"use client"

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { CardContent } from '@/components/Card/CardContent';
import { Bell } from 'lucide-react';
import CustomerAppLayout from '@/components/layouts/CustomerAppLayout';
import AppLayout from '@/components/layouts/AppLayout';
import useUser from '@/hooks/useUser';

interface INotification {
    id: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
    icon: string;
}

export default function Notifications() {
    const [notifications] = useState<INotification[]>([]);


    const { isCustomer, isBusiness } = useUser();

    const Layout = useMemo(() => {
        if (isCustomer || isBusiness) {
            return CustomerAppLayout
        }
        return AppLayout
    }, [isCustomer, isBusiness])
    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold">Notifications</h1>
                </div>

                <div className="space-y-4">
                    {notifications.length < 1 && <div>No notifications</div>}
                    {notifications.map((notification) => (
                        <Card key={notification.id} className={`${notification.unread ? 'bg-blue-50' : 'bg-white'}`}>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">{notification.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold">{notification.title}</h3>
                                            <span className="text-sm text-gray-500">{notification.time}</span>
                                        </div>
                                        <p className="text-gray-600 mt-1">{notification.message}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}