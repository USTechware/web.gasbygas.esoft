'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Modal from '@/components/modal';
import Button from '@/components/subcomponents/button';
import Input from '@/components/subcomponents/input';
import Select from '@/components/subcomponents/select';
import { Table } from '@/components/table';
import { Dispatch, RootState } from '@/data';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { UserRole } from '../api/types/user';
import { RequestStatus } from '../api/types/requests';
import StatusLabel from '@/components/status';

export default function Requests() {
    const dispatch = useDispatch<Dispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const requests = useSelector((state: RootState) => state.requests.list);
    const outlets = useSelector((state: RootState) => state.outlets.list);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        dispatch.outlets.fetchOutlets();
        dispatch.requests.fetchRequests();
    }, [dispatch]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        outlet: '',
        quantity: 0,
        dateRequested: moment().format('YYYY-MM-DD'),
    });

    const [formErrors, setFormErrors] = useState({
        outlet: '',
        quantity: '',
        dateRequested: '',
    });

    const columns = [
        { key: 'token', label: 'Token' },
        { key: 'outlet', label: 'Outlet', render: (request: any) => `${request.outlet.name}` },
        { key: 'quantity', label: 'Quantity' },
        { key: 'dateRequested', label: 'Date Requested' },
        {
            key: 'status', label: 'Status', render: (request: any) => <StatusLabel status={request.status} />
        },
    ];

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setFormData({
            outlet: '',
            quantity: 0,
            dateRequested: '',
        });
        setFormErrors({
            outlet: '',
            quantity: '',
            dateRequested: '',
        });
        setIsPopupOpen(false);
    };

    const handleChangeField = (field: string, val: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'quantity' ? parseInt(val) : val,
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

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const data = await dispatch.requests.createRequest(formData);
            toast.success(data?.message || "Request has been made successfully");
            dispatch.requests.fetchRequests();
            handleClosePopup();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unknown error occurred!");
            console.log('Create delivery failed:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleIssueRequest = async (item: any) => {
        try {
            const data = await dispatch.requests.issueRequest({ _id: item._id });
            toast.success(data?.message || "Request has been issued successfully");
            dispatch.requests.fetchRequests();
            handleClosePopup();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unknown error occurred!");
            console.log('Create delivery failed:', error);
        }
    }
    const handleExpireRequest = async (item: any) => {
        try {
            const data = await dispatch.requests.expireRequest({ _id: item._id });
            toast.success(data?.message || "Request has been expired successfully");
            dispatch.requests.fetchRequests();
            handleClosePopup();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unknown error occurred!");
            console.log('Create delivery failed:', error);
        }
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Customer Requests</h1>

                {/* Add Request Button */}
                {user?.userRole === UserRole.CUSTOMER || user?.userRole === UserRole.BUSINESS &&
                    <div className='my-2'>
                        <Button onClick={handleOpenPopup} text=' Create Request' />
                    </div>
                }

                {/* Requests Table */}
                <Table columns={columns} data={requests}
                    actions={[
                        { label: 'Issue Request', onClick: handleIssueRequest, condition: (item: any) => item.status === RequestStatus.PENDING },
                        { label: 'Expire Request', onClick: handleExpireRequest, condition: (item: any) => item.status === RequestStatus.PENDING },
                    ]} />

                {/* Popup for Creating Request */}
                <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <Modal.Header>Create Request</Modal.Header>
                    <Modal.Content>
                        <div className='mb-2'>
                            <Select
                                label='Outlet'
                                value={formData.outlet}
                                options={outlets.map((outlet) => ({ value: String(outlet._id), label: `${outlet.name} (${outlet.district})` }))}
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
                                label='Date of Request'
                                value={formData.dateRequested}
                                type='date'
                                min={moment().format('YYYY-MM-DD')}
                                max={moment().add(2, 'weeks').format('YYYY-MM-DD')}
                                onChange={handleChangeField.bind(null, 'dateRequested')}
                                error={formErrors.dateRequested}
                            />
                        </div>

                    </Modal.Content>
                    <Modal.Footer>
                        <div className="flex gap-2 justify-end">
                            <Button
                                text='Submit'
                                isLoading={isLoading}
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
