'use client';

import AppLayout from '@/components/layouts/AppLayout';
import DashboardWidget from '@/components/widget';
import { Building2Icon, CalculatorIcon, CogIcon, ShipIcon, ShoppingCart } from 'lucide-react';
import useUser from '@/hooks/useUser';
import useDashboard from '@/hooks/useDashboard';

export default function Dashboard() {
    const { user, isAdmin, isOutletManager, isCustomer, isBusiness } = useUser();
    const data = useDashboard();
    
    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
                <div className="container mx-auto py-8 px-4">
                    {!data ? (
                        <p className="text-center text-lg text-gray-600 dark:text-gray-300">Loading...</p>
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Welcome, {user?.firstName}!</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {
                                    isAdmin &&
                                    <>
                                        <DashboardWidget icon={<Building2Icon />} title='Outlets' path='/outlets' children={data.outlets} />
                                        <DashboardWidget icon={<CalculatorIcon />} title='Inventry' path='/inventory' children={data.inventory} />
                                        <DashboardWidget icon={<ShoppingCart />} title='Requests' children={data.requests} />
                                        <DashboardWidget icon={<ShipIcon />} title='Deliveries'  path='/deliveries' children={data.deliveries} />
                                    </>
                                    }
                                    
                                    {
                                    isOutletManager &&
                                    <>
                                        <DashboardWidget icon={<CalculatorIcon />} title='Stocks' path='/stocks' children={data.stocks} />
                                        <DashboardWidget icon={<ShoppingCart />} title='Requests' path='/requests' children={data.requests} />
                                        <DashboardWidget icon={<ShipIcon />} title='Deliveries'  path='/deliveries' children={data.deliveries} />
                                    </>
                                    }
                                    
                                    {
                                    (isCustomer || isBusiness) &&
                                    <>
                                        <DashboardWidget icon={<ShoppingCart />} title='Requests' path='/requests' children={data.requests} />
                                         </>
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
