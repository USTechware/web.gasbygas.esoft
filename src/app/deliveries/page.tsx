'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Modal from '@/components/modal';
import Button from '@/components/subcomponents/button';
import { Table } from '@/components/table';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/data';
import { toast } from 'react-toastify';
import Input from '@/components/subcomponents/input';
import Select from '@/components/subcomponents/select';
import moment from 'moment';
import { UserRole } from '../api/types/user';
import StatusLabel from '@/components/status';
import AuthRoleCheck from '@/components/Auth';
import { DeliveryStatus } from '../api/types/deliveries';

function Deliveries() {
    const dispatch = useDispatch<Dispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const deliveries = useSelector((state: RootState) => state.deliveries.list);
    const outlets = useSelector((state: RootState) => state.outlets.list);

    useEffect(() => {
        dispatch.outlets.fetchOutlets();
        dispatch.deliveries.fetchDeliveries();
    }, [dispatch]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        outlet: '',
        quantity: 0,
        dateOfDelivery: moment().format('YYYY-MM-DD')
    });

    const [formErrors, setFormErrors] = useState({
        outlet: '',
        quantity: '',
        dateOfDelivery: ''
    });

    const columns = [
        { key: 'outlet', label: 'Outlet', render: (delivery: any) => `${delivery.outlet.name}/${delivery.outlet.district}` },
        { key: 'quantity', label: 'Quantity' },
        { key: 'dateOfDelivery', label: 'Delivery Date', render: (delivery: any) => moment(delivery.dateOfDelivery).format('YYYY-MM-DD') },
        { key: 'status', label: 'Status', render: (request: any) => <StatusLabel status={request.status} /> }
    ];

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setFormData({
            outlet: '',
            quantity: 0,
            dateOfDelivery: ''
        });
        setFormErrors({
            outlet: '',
            quantity: '',
            dateOfDelivery: ''
        });
        setIsPopupOpen(false);
    };

    const handleChangeField = (field: string, val: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'quantity' ? parseInt(val):  val,
        }));
    };

    const validateForm = () => {
        const errors = {
            outlet: '',
            quantity: '',
            dateOfDelivery: ''
        };
        let isValid = true;

        if (!formData.outlet) {
            errors.outlet = 'Outlet is required';
            isValid = false;
        }

        if (!formData.quantity) {
            errors.quantity = 'Quantity is required';
            isValid = false;
        }

        if (!formData.dateOfDelivery) {
            errors.dateOfDelivery = 'Delivery date is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const data = await dispatch.deliveries.createDelivery(formData);
            toast.success(data?.message || "Delivery has been scheduled successfully");
            dispatch.deliveries.fetchDeliveries();
            handleClosePopup();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unknown error occurred!");
            console.log('Create delivery failed:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleConfirmDelivery = async (item: any) => {
        try {
            const data = await dispatch.deliveries.confirmDelivery({ _id: item._id });
            toast.success(data?.message || "Delivery has been confirmed recieved successfully");
            dispatch.deliveries.fetchDeliveries();
            handleClosePopup();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unknown error occurred!");
            console.log('Create delivery failed:', error);
        }
    }
    const actions = useMemo(() => {
        if (user?.userRole === UserRole.OUTLET_MANAGER) {
            return [
                { label: 'Confirm Delivery', onClick: handleConfirmDelivery, condition: (item: any) => item.status === DeliveryStatus.PENDING },
            ]
        }else {
            return []
        }
    }, [user])

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Deliveries</h1>

                {/* Schedule Delivery Button */}
                {user?.userRole === UserRole.DISTRIBUTOR &&
                    <div className='my-2'>
                        <Button
                            text='Schedule Delivery'
                            onClick={handleOpenPopup}
                        />
                    </div>
                }

                {/* Deliveries Table */}
                <Table columns={columns} data={deliveries} actions={actions}/>

                <Modal isOpen={isPopupOpen} onClose={handleClosePopup}>
                    <Modal.Header>Schedule Delivery</Modal.Header>
                    <Modal.Content>
                        <div className='mb-2'>
                            <Select
                                label='Outlet'
                                value={formData.outlet}
                                options={outlets.map((outlet) => ({ value: String(outlet._id), label: `${outlet.name} (${outlet.district})`}))}
                                onChange={handleChangeField.bind(null, 'outlet')}
                                error={formErrors.outlet}
                            />
                        </div>

                        <div className='mb-2'>
                            <Input
                                label='Quantity'
                                type='number'
                                min={0}
                                value={formData.quantity}
                                onChange={handleChangeField.bind(null, 'quantity')}
                                error={formErrors.quantity}
                            />
                        </div>

                        <div className='mb-2'>
                            <Input
                                label='Date of Delivery'
                                value={formData.dateOfDelivery}
                                type='date'
                                onChange={handleChangeField.bind(null, 'dateOfDelivery')}
                                error={formErrors.dateOfDelivery}
                            />
                        </div>
                    </Modal.Content>
                    <Modal.Footer>
                        <div className="flex justify-end gap-2">
                            <Button
                                text='Submit'
                                isLoading={isLoading}
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

export default AuthRoleCheck(Deliveries, { roles: [UserRole.DISTRIBUTOR, UserRole.OUTLET_MANAGER]})