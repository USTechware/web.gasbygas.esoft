'use client';

import AuthRoleCheck from '@/components/Auth';
import AppLayout from '@/components/layouts/AppLayout';
import Modal from '@/components/modal';
import Button from '@/components/subcomponents/button';
import Input from '@/components/subcomponents/input';
import { Table } from '@/components/table';
import { Dispatch, RootState } from '@/data';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { UserRole } from '../api/types/user';
import { GasTypes, GasTypesValues } from '@/constants/common';
import Select from '@/components/subcomponents/select';

function Inventory() {
    const dispatch = useDispatch<Dispatch>();
    const { currentStock, history = [] } = useSelector((state: RootState) => state.inventory)

    useEffect(() => {
        dispatch.inventory.fetchInventory();
    }, [])

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({ type: GasTypes.TWO_KG, quantity: 0, dateAdded: moment().format('YYYY-MM-YY') });
    const [formErrors, setFormErrors] = useState({ type: '', quantity: '', dateAdded: '' });

    const handleAddInventory = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setFormData({ type: GasTypes.TWO_KG, quantity: 0, dateAdded: moment().format('YYYY-MM-YY') });
        setFormErrors({ type: '', quantity: '', dateAdded: '' });
        setIsPopupOpen(false);
    };

    const handleChangeField = (field: string, val: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'quantity' ? parseInt(val) : val,
        }));
    };

    const validateForm = () => {
        const errors = { type: GasTypes.TWO_KG, quantity: '', dateAdded: '' };
        let isValid = true;

        if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
            errors.quantity = 'Please enter a valid quantity';
            isValid = false;
        }

        if (!formData.dateAdded) {
            errors.dateAdded = 'Please select a valid date';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const data = await dispatch.inventory.createInventory(formData);

            toast.success(data?.message || "Inventory has been updated successfully")
            dispatch.inventory.fetchInventory()

            handleClosePopup();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unknown error occurred!")
            console.log('Create inventory failed:', error);
        } finally {
            setIsLoading(false);
        }


        handleClosePopup();
    };

    const columns = [
        { key: 'dateAdded', label: 'Date Added', render: (inv: any) => moment(inv.dateAdded).format('YYYY-MM-DD') },
        { key: 'type', label: 'Type', render: ({ type: key }: { type: string }) => (GasTypesValues as any)[key] },
        { key: 'quantity', label: 'Quantity' },
    ];
    console.log(Object.entries(currentStock))
    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200">Inventory Management</h1>

                {/* Current Stock Card */}
                <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-gray-100">Current Gas Cylinders Stock</h2>
                    {
                        !!currentStock &&
                        <div className="font-extrabold">
                            <table className='my-2 border-separate border border-gray-400 w-[300px]'>
                                <tbody>
                                    {Object.entries(currentStock).map((item, idx) => (
                                        <tr key={idx}>
                                            <td className='border border-gray-300'>{(GasTypesValues as any)[item[0]]} Cylinders</td>
                                            <td className='border border-gray-300 text-center'>{item[1]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                    <Button
                        text='Add Inventory'
                        onClick={handleAddInventory}
                    />
                </div>

                {/* History Table */}
                <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Inventory History</h2>
                <Table columns={columns} data={history} />

                {/* Add Inventory Popup */}
                <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <Modal.Header>Add Inventory</Modal.Header>
                    <Modal.Content>
                        <div className="mb-4">
                            <Select
                                error={formErrors.type}
                                options={Object.entries(GasTypes).map((item) => ({ label: item[1], value: item[0] }))}
                                value={formData.type} label='Type' onChange={handleChangeField.bind(null, 'type')} />

                        </div>
                        <div className="mb-4">
                            <Input id='' type='number'
                                error={formErrors.quantity}
                                min={0}
                                value={formData.quantity} label='Qunatity' onChange={handleChangeField.bind(null, 'quantity')} />

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
                                isLoading={isLoading}
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

export default AuthRoleCheck(Inventory, { roles: [UserRole.ADMIN] })