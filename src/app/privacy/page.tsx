"use client"

import React, { useMemo } from 'react';
import { Card } from '@/components/Card';
import { CardContent } from '@/components/Card/CardContent';
import { Shield } from 'lucide-react';
import useUser from '@/hooks/useUser';
import CustomerAppLayout from '@/components/layouts/CustomerAppLayout';
import AppLayout from '@/components/layouts/AppLayout';

export default function Contact() {

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
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold">GasByGas</h1>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Request Gas Cylinder</h2>
                            <p className="text-gray-600">
                                To request a gas cylinder, simply provide your delivery address and select
                                the type of cylinder you need. Our service will ensure timely delivery to your location.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. Waiting</h2>
                            <p className="text-gray-600">
                                Once your request is received, our team will process the order. You will be notified
                                as soon as the cylinder is on its way to you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Collect</h2>
                            <p className="text-gray-600">
                                When the cylinder arrives, our delivery personnel will help you collect it. Please ensure
                                you are available to receive the delivery at the scheduled time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Notifications</h2>
                            <p className="text-gray-600">
                                Throughout the process, you will receive notifications about the status of your request,
                                including delivery updates and any other important information.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
