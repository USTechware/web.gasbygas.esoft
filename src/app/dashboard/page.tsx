'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layouts/AppLayout';
import DashboardWidget from '@/components/widget';
import { Building2Icon, CalculatorIcon, CogIcon, ShipIcon } from 'lucide-react';
import Button from '@/components/subcomponents/button';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/data';

export default function Dashboard() {
    const dispatch = useDispatch<Dispatch>();
    const user = useSelector((state: RootState) => state.auth.user)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            dispatch.auth.fetchUser();
            setIsLoading(false)
        };

        fetchUser();
    }, []);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
                <div className="container mx-auto py-8 px-4">
                    {isLoading ? (
                        <p className="text-center text-lg text-gray-600 dark:text-gray-300">Loading...</p>
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Welcome, {user?.firstName}!</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <DashboardWidget icon={<Building2Icon/>} title='Outlets' children={ 20 } />
                                    <DashboardWidget icon={<CalculatorIcon/>} title='Inventry' children={ 1450 } />
                                    <DashboardWidget icon={<ShipIcon/>} title='Deliveries' children={200} footer={ 'Pending'} />
                            </div>

                            <div className="mt-8">
                                    <Button text=' Go to Outlets' onClick={() => { window.location.href = "/outlets"}} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
