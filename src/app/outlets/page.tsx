'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Modal from '@/components/modal';
import Button from '@/components/subcomponents/button';
import { Table } from '@/components/table';
import { useState } from 'react';

export default function Outlets() {
    const [outlets, setOutlets] = useState([
        {
            id: '1',
            name: 'Main Outlet',
            location: '123 Elm St',
            status: 'Open',
            managerName: 'Alice Johnson',
            managerEmail: 'alice.johnson@example.com',
            managerPhoneNumber: '+1 234-567-8901',
        },
        {
            id: '2',
            name: 'Downtown Outlet',
            location: '456 Oak Ave',
            status: 'Closed',
            managerName: 'Bob Smith',
            managerEmail: 'bob.smith@example.com',
            managerPhoneNumber: '+1 987-654-3210',
        },
        {
            id: '3',
            name: 'Uptown Outlet',
            location: '789 Pine Rd',
            status: 'Open',
            managerName: 'Charlie Davis',
            managerEmail: 'charlie.davis@example.com',
            managerPhoneNumber: '+1 456-789-0123',
        },
    ]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        district: '',
        name: '',
        address: '',
        managerName: '',
        managerEmail: '',
        managerPhoneNumber: '',
    });

    const [formErrors, setFormErrors] = useState({
        district: '',
        name: '',
        address: '',
        managerName: '',
        managerEmail: '',
        managerPhoneNumber: '',
    });

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status' },
        { key: 'managerName', label: 'Manager Name' },
        { key: 'managerEmail', label: 'Manager Email' },
        { key: 'managerPhoneNumber', label: 'Manager Phone' },
    ];

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setFormData({
            district: '',
            name: '',
            address: '',
            managerName: '',
            managerEmail: '',
            managerPhoneNumber: '',
        });
        setFormErrors({
            district: '',
            name: '',
            address: '',
            managerName: '',
            managerEmail: '',
            managerPhoneNumber: '',
        });
        setIsPopupOpen(false);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const errors = {
            district: '',
            name: '',
            address: '',
            managerName: '',
            managerEmail: '',
            managerPhoneNumber: '',
        };
        let isValid = true;

        if (!formData.district) {
            errors.district = 'District is required';
            isValid = false;
        }

        if (!formData.name) {
            errors.name = 'Outlet name is required';
            isValid = false;
        }

        if (!formData.address) {
            errors.address = 'Address is required';
            isValid = false;
        }

        if (!formData.managerName) {
            errors.managerName = 'Manager name is required';
            isValid = false;
        }

        if (!formData.managerEmail) {
            errors.managerEmail = 'Manager email is required';
            isValid = false;
        }

        if (!formData.managerPhoneNumber) {
            errors.managerPhoneNumber = 'Manager phone number is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const newOutlet = {
            id: (outlets.length + 1).toString(),
            name: formData.name,
            location: `${formData.district}, ${formData.address}`,
            status: 'Open',
            managerName: formData.managerName,
            managerEmail: formData.managerEmail,
            managerPhoneNumber: formData.managerPhoneNumber,
        };

        setOutlets(prevOutlets => [...prevOutlets, newOutlet]);
        handleClosePopup();
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Outlets</h1>

                {/* Add Outlet Button */}
                <div className='my-2'>
                    <Button
                        text=' Create Outlet'
                        onClick={handleOpenPopup}
                    />
                </div>

                {/* Outlets Table */}
                <Table columns={columns} data={outlets} />

                <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <Modal.Header>Create Outlet</Modal.Header>
                    <Modal.Content>
                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">District</label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.district && <span className="text-red-600">{formErrors.district}</span>}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">Outlet Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.name && <span className="text-red-600">{formErrors.name}</span>}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.address && <span className="text-red-600">{formErrors.address}</span>}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">Manager Name</label>
                            <input
                                type="text"
                                name="managerName"
                                value={formData.managerName}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.managerName && <span className="text-red-600">{formErrors.managerName}</span>}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">Manager Email</label>
                            <input
                                type="email"
                                name="managerEmail"
                                value={formData.managerEmail}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.managerEmail && <span className="text-red-600">{formErrors.managerEmail}</span>}
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-700 dark:text-gray-100">Manager Phone Number</label>
                            <input
                                type="text"
                                name="managerPhoneNumber"
                                value={formData.managerPhoneNumber}
                                onChange={handleFormChange}
                                className="w-full p-2 mb-4 border rounded-md"
                            />
                            {formErrors.managerPhoneNumber && (
                                <span className="text-red-600">{formErrors.managerPhoneNumber}</span>
                            )}
                        </div>

                    </Modal.Content>
                    <Modal.Footer>
                        <div className="flex justify-end gap-2">
                            <Button
                                text='Submit'
                                onClick={handleSubmit}
                            />
                            <Button
                                text='Cancel'
                                color='secondary'
                                onClick={handleClosePopup}
                            />
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </AppLayout>
    );
}
