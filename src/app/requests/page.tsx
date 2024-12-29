'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Modal from '@/components/modal';
import Button from '@/components/subcomponents/button';
import { Table } from '@/components/table';
import { useState } from 'react';

export default function Requests() {
    const [requests, setRequests] = useState([
        {
            id: '1',
            customer: 'Alice Johnson',
            outlet: 'Main Outlet',
            quantity: 2,
            dateRequested: '2024-12-26',
            status: 'Pending',
        },
        {
            id: '2',
            customer: 'Bob Smith',
            outlet: 'Downtown Outlet',
            quantity: 1,
            dateRequested: '2024-12-25',
            status: 'Shipped',
        },
        {
            id: '3',
            customer: 'Charlie Davis',
            outlet: 'Uptown Outlet',
            quantity: 3,
            dateRequested: '2024-12-24',
            status: 'Delivered',
        },
    ]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        customer: '',
        outlet: '',
        quantity: '',
        dateRequested: '',
        status: 'Pending',
    });

    const [formErrors, setFormErrors] = useState({
        customer: '',
        outlet: '',
        quantity: '',
        dateRequested: '',
    });

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'outlet', label: 'Outlet' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'dateRequested', label: 'Date Requested' },
        { key: 'status', label: 'Status' },
    ];

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setFormData({
            customer: '',
            outlet: '',
            quantity: '',
            dateRequested: '',
            status: 'Pending',
        });
        setFormErrors({
            customer: '',
            outlet: '',
            quantity: '',
            dateRequested: '',
        });
        setIsPopupOpen(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors = {
            customer: '',
            outlet: '',
            quantity: '',
            dateRequested: '',
        };
        let isValid = true;

        if (!formData.customer) {
            errors.customer = 'Customer name is required';
            isValid = false;
        }

        if (!formData.outlet) {
            errors.outlet = 'Outlet is required';
            isValid = false;
        }

        if (!formData.quantity) {
            errors.quantity = 'Quantity is required';
            isValid = false;
        } else if (isNaN(Number(formData.quantity))) {
            errors.quantity = 'Quantity must be a number';
            isValid = false;
        }

        if (!formData.dateRequested) {
            errors.dateRequested = 'Date requested is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const newRequest = {
            id: (requests.length + 1).toString(),
            ...formData,
        };

        // setRequests(prevRequests => [...prevRequests, newRequest]);
        handleClosePopup();
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Customer Requests</h1>

                {/* Add Request Button */}
                <div className='my-2'>
                    <Button onClick={handleOpenPopup} text=' Create Request' />
                </div>

                {/* Requests Table */}
                <Table columns={columns} data={requests} />

                {/* Popup for Creating Request */}
                <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <Modal.Header>Create Request</Modal.Header>
                    <Modal.Content>
                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">Customer Name</label>
                            <input
                                type="text"
                                name="customer"
                                value={formData.customer}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.customer && <span className="text-red-600">{formErrors.customer}</span>}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">Outlet</label>
                            <input
                                type="text"
                                name="outlet"
                                value={formData.outlet}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.outlet && <span className="text-red-600">{formErrors.outlet}</span>}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">Quantity</label>
                            <input
                                type="text"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.quantity && <span className="text-red-600">{formErrors.quantity}</span>}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">Date Requested</label>
                            <input
                                type="date"
                                name="dateRequested"
                                value={formData.dateRequested}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.dateRequested && <span className="text-red-600">{formErrors.dateRequested}</span>}
                        </div>

                    </Modal.Content>
                    <Modal.Footer>
                        <div className="flex gap-2 justify-end">
                            <Button
                                text='Submit'
                                onClick={handleSubmit}
                            />
                            <Button
                                color='secondary'
                                text='Cancel'
                                onClick={handleClosePopup}
                            />
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </AppLayout>
    );
}
