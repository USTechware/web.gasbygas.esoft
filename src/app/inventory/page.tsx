'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Modal from '@/components/modal';
import Button from '@/components/subcomponents/button';
import { Table } from '@/components/table';
import { useState } from 'react';

export default function Inventory() {
    const [currentStock, setCurrentStock] = useState(120); // Current stock of gas cylinders
    const [inventoryHistory, setInventoryHistory] = useState([
        { date: '2024-12-01', quantity: 50 },
        { date: '2024-11-25', quantity: 70 },
        { date: '2024-11-20', quantity: 100 },
    ]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [form, setForm] = useState({ quantity: '', date: '' });
    const [formErrors, setFormErrors] = useState({ quantity: '', date: '' });

    const handleAddInventory = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setForm({ quantity: '', date: '' });
        setFormErrors({ quantity: '', date: '' });
        setIsPopupOpen(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors = { quantity: '', date: '' };
        let isValid = true;

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

        const newEntry = {
            date: form.date,
            quantity: Number(form.quantity),
        };

        setInventoryHistory((prev) => [newEntry, ...prev]);
        setCurrentStock((prev) => prev + newEntry.quantity);

        handleClosePopup();
    };

    const columns = [
        { key: 'date', label: 'Date Added' },
        { key: 'quantity', label: 'Quantity' },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200">Inventory Management</h1>

                {/* Current Stock Card */}
                <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-gray-100">Current Gas Cylinders Stock</h2>
                    <p className="text-4xl font-extrabold text-blue-700 dark:text-blue-300">{currentStock}</p>
                    <Button
                        text='Add Inventory'
                        onClick={handleAddInventory}
                    />
                </div>

                {/* History Table */}
                <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Inventory History</h2>
                <Table columns={columns} data={inventoryHistory} />

                {/* Add Inventory Popup */}
                <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <Modal.Header>Add Inventory</Modal.Header>
                    <Modal.Content>
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
                                text='Submit'
                                onClick={handleSubmit}
                            />
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </AppLayout>
    );
}
