"use client"

import React, { useMemo } from 'react';
import { Card } from '@/components/Card';
import { CardContent } from '@/components/Card/CardContent';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
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
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold">Contact Us</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Mail className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-medium">Email</h3>
                                        <p className="text-gray-600">support@gasbygas.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-medium">Phone</h3>
                                        <p className="text-gray-600">+94 777777777</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <MapPin className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-medium">Address</h3>
                                        <p className="text-gray-600">
                                            No 5, Peradeniya Rd,<br />
                                            Kandy.<br />
                                            Sri Lanka.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}