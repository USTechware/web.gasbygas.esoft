"use client"

import React, { useMemo } from 'react';
import { Card } from '@/components/Card';
import { CardContent } from '@/components/Card/CardContent';
import { ScrollText } from 'lucide-react';
import useUser from '@/hooks/useUser';
import CustomerAppLayout from '@/components/layouts/CustomerAppLayout';
import AppLayout from '@/components/layouts/AppLayout';

export default function TermsAndConditions() {

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
                    <ScrollText className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold">GasByGas Terms and Conditions</h1>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Service Usage</h2>
                            <p className="text-gray-600">
                                By using the GasByGas platform, you agree to comply with all applicable laws 
                                and regulations. GasByGas provides a service to request, track, and receive 
                                gas cylinders conveniently.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. Order and Delivery</h2>
                            <p className="text-gray-600">
                                When placing an order for a gas cylinder, you must provide accurate delivery details. 
                                GasByGas reserves the right to cancel or modify any order due to incorrect information 
                                or availability constraints.
                            </p>
                            <div className="mt-3 space-y-2 text-gray-600">
                                <p>By using our service, you acknowledge:</p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Orders are subject to availability and may be delayed due to demand.</li>
                                    <li>Delivery times are estimates and may vary based on external factors.</li>
                                    <li>Additional delivery charges may apply depending on your location.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Account Responsibilities</h2>
                            <p className="text-gray-600">
                                You are responsible for maintaining the security of your account credentials. 
                                GasByGas is not liable for unauthorized access to your account due to negligence 
                                in safeguarding your password or device.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Payments and Refunds</h2>
                            <p className="text-gray-600">
                                Payments for gas cylinders must be completed through approved payment methods. 
                                Refunds will only be processed in cases where GasByGas is unable to fulfill 
                                the order due to service limitations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Liability and Safety</h2>
                            <p className="text-gray-600">
                                GasByGas ensures that cylinders meet safety standards, but it is your responsibility 
                                to handle and store them safely. We are not responsible for damages caused due to 
                                improper use or storage of gas cylinders.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Modifications to Terms</h2>
                            <p className="text-gray-600">
                                GasByGas reserves the right to update these terms at any time. Continued use of 
                                our services after changes implies your acceptance of the revised terms.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
