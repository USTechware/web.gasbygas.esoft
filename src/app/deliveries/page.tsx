'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Modal from '@/components/modal';
import Button from '@/components/subcomponents/button';
import { Table } from '@/components/table';
import { useState } from 'react';

export default function Deliveries() {
    const [deliveries, setDeliveries] = useState([
        { id: '1', customer: 'Alice', address: '123 Elm St', status: 'Pending', date: '2024-12-20' },
        { id: '2', customer: 'Bob', address: '456 Oak Ave', status: 'Shipped', date: '2024-12-18' },
        { id: '3', customer: 'Charlie', address: '789 Pine Rd', status: 'Delivered', date: '2024-12-15' },
    ]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [form, setForm] = useState({ outlet: '', quantity: '', date: '' });
    const [formErrors, setFormErrors] = useState({ outlet: '', quantity: '', date: '' });

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'address', label: 'Address' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date of Delivery' },
    ];

    const handleScheduleDelivery = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setForm({ outlet: '', quantity: '', date: '' });
        setFormErrors({ outlet: '', quantity: '', date: '' });
        setIsPopupOpen(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors = { outlet: '', quantity: '', date: '' };
        let isValid = true;

        if (!form.outlet) {
            errors.outlet = 'Please select an outlet';
            isValid = false;
        }

        if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) {
            errors.quantity = 'Please enter a valid quantity';
            isValid = false;
        }

        if (!form.date) {
            errors.date = 'Please select a valid date';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const newDelivery = {
            id: String(deliveries.length + 1),
            customer: form.outlet,
            address: 'Selected Outlet Address', // Replace with actual outlet data
            status: 'Scheduled',
            date: form.date,
        };

        setDeliveries((prev) => [newDelivery, ...prev]);
        handleClosePopup();
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Deliveries</h1>

                {/* Schedule Delivery Button */}
                <div className='my-2'>
                    <Button
                        text='Schedule a Delivery'
                        onClick={handleScheduleDelivery}
                    />
                </div>

                {/* Delivery Table */}
                <Table columns={columns} data={deliveries} />

                {/* Popup for Scheduling Delivery */}
                <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <Modal.Header>Schedule Delivery</Modal.Header>
                    <Modal.Content>
                        {/* Outlet Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Select Outlet
                            </label>
                            <select
                                name="outlet"
                                value={form.outlet}
                                onChange={handleFormChange}
                                className={`block w-full px-3 py-2 rounded-md border focus:outline-none sm:text-sm 
                                        ${formErrors.outlet
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            >
                                <option value="">Select an Outlet</option>
                                <option value="Outlet A">Outlet A</option>
                                <option value="Outlet B">Outlet B</option>
                                <option value="Outlet C">Outlet C</option>
                            </select>
                            {formErrors.outlet && (
                                <p className="mt-2 text-sm text-red-600">{formErrors.outlet}</p>
                            )}
                        </div>

                        {/* Quantity Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleFormChange}
                                className={`block w-full px-3 py-2 rounded-md border focus:outline-none sm:text-sm 
                                        ${formErrors.quantity
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />
                            {formErrors.quantity && (
                                <p className="mt-2 text-sm text-red-600">{formErrors.quantity}</p>
                            )}
                        </div>

                        {/* Date Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleFormChange}
                                className={`block w-full px-3 py-2 rounded-md border focus:outline-none sm:text-sm 
                                        ${formErrors.date
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />
                            {formErrors.date && (
                                <p className="mt-2 text-sm text-red-600">{formErrors.date}</p>
                            )}
                        </div>
                    </Modal.Content>
                    <Modal.Footer>
                        <div className="flex justify-end gap-2">
                            <Button
                                color='secondary'
                                text='Cancel'
                                onClick={handleClosePopup}
                            />
                            <Button
                                text='Schedule'
                                onClick={handleSubmit}
                            />
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </AppLayout >
    );
}
