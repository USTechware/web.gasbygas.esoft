'use client';

import AppLayout from '@/components/layouts/AppLayout';
import Modal from '@/components/modal';
import Button from '@/components/subcomponents/button';
import Input from '@/components/subcomponents/input';
import Select from '@/components/subcomponents/select';
import { Table } from '@/components/table';
import { Dispatch, RootState } from '@/data';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { UserRole } from '../api/types/user';
import { RequestStatus } from '../api/types/requests';
import StatusLabel from '@/components/status';
import { IRequest } from '../api/models/request.model';
import ViewCustomer from '@/components/requests/ViewCustomer';
import SendSMS from '@/components/requests/SendSMS';
import AuthRoleCheck from '@/components/Auth';
import Rescheduler from '@/components/requests/Rescheduler';
import useUser from '@/hooks/useUser';
import Transfer from '@/components/requests/Transfer';

function Requests() {
    const dispatch = useDispatch<Dispatch>();
    const { user, isCustomer, isBusiness, isOutletManager } = useUser()
    const requests = useSelector((state: RootState) => state.requests.list);
    const outlets = useSelector((state: RootState) => state.outlets.list);
    const customers = useSelector((state: RootState) => state.outlets.customers);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {

        if (isOutletManager) {
            dispatch.outlets.fetchCustomers()
        }

    }, [isOutletManager])

    const [currentRequest, setCurrentRequest] = useState<{ id: string, item: any, action: 'view' | 'sms' | 'rescheduler' | 'transfer' } | null>(null)

    const [filteredRequests, setFilteredRequests] = useState<IRequest[]>([])
    const [searchToken, setSearchToken] = useState<string>('');
    const onSearchToken = (field: string, val: any) => {
        setSearchToken(val)
    };

    useEffect(() => {
        let filtered = requests
        if (searchToken) {
            filtered = requests.filter(r => r.token?.toLowerCase().includes(searchToken.toLocaleLowerCase()))
        }

        setFilteredRequests(filtered as any)
    }, [searchToken, requests])

    useEffect(() => {
        dispatch.outlets.fetchOutlets();
        dispatch.requests.fetchRequests();
    }, [dispatch]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        customerId: null,
        outlet: '',
        quantity: 0,
    });

    const [formErrors, setFormErrors] = useState({
        customerId: '',
        outlet: '',
        quantity: '',
    });

    const columns = [
        { key: 'token', label: 'Token' },
        { key: 'outlet', label: 'Outlet', render: (request: any) => `${request.outlet.name}` },
        { key: 'quantity', label: 'Quantity' },
        { key: 'deadlineForPickup', label: 'Deadline(Pickup)', render: (request: any) => moment(request.deadlineForPickup).format('YYYY-MM-DD') },
        {
            key: 'status', label: 'Status', render: (request: any) => <StatusLabel status={request.status} />
        },
    ];

    if (isOutletManager) {
        columns.splice(
            1,
            1,
            { key: 'user', label: 'Customer/Business', render: (request: any) => `${request.user.firstName} ${request.user.lastName}` },
        )
    }

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setFormData({
            customerId: null,
            outlet: '',
            quantity: 0,
        });
        setFormErrors({
            customerId: '',
            outlet: '',
            quantity: '',
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
            customerId: '',
            outlet: '',
            quantity: '',
        };
        let isValid = true;

        if ((isCustomer || isBusiness) && !formData.outlet) {
            errors.outlet = 'Outlet is required';
            isValid = false;
        }

        if (isOutletManager && !formData.customerId) {
            errors.customerId = 'Customer/Business is required';
            isValid = false;
        }

        if (!formData.quantity) {
            errors.quantity = 'Quantity is required';
            isValid = false;
        } else if (isNaN(Number(formData.quantity))) {
            errors.quantity = 'Quantity must be a number';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const payload: any = {
                quantity: formData.quantity,
                customerId: undefined,
                outlet: undefined,
            }
            if (isOutletManager) {
                payload.customerId = formData.customerId
            } else {
                payload.outlet = formData.outlet
            }
            const data = await dispatch.requests.createRequest(payload);
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


    const handleCancelRequest = async (item: any) => {
        try {
            const data = await dispatch.requests.cancelRequest({ _id: item._id });
            toast.success(data?.message || "Request has been cancelled successfully");
            dispatch.requests.fetchRequests();
            handleClosePopup();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unknown error occurred!");
            console.log('Cancel delivery failed:', error);
        }
    }

    const handleResceduleRequest = async (item: any) => {
        setCurrentRequest({ id: item._id, item, action: 'rescheduler' })
    }

    const handleTransferRequest = async (item: any) => {
        setCurrentRequest({ id: item._id, item, action: 'transfer' })
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

    const handleViewCustomer = async (item: any) => {
        setCurrentRequest({ id: item._id, item, action: 'view' })

    }

    const handleSendMessage = async (item: any) => {
        setCurrentRequest({ id: item._id, item, action: 'sms' })
    }


    const actions = useMemo(() => {
        if (user?.userRole === UserRole.OUTLET_MANAGER) {
            return [
                { label: 'Issue Request', onClick: handleIssueRequest, condition: (item: any) => item.status === RequestStatus.PENDING },
                { label: 'Expire Request', onClick: handleExpireRequest, condition: (item: any) => item.status === RequestStatus.PENDING },
                { label: 'Cancel Request', onClick: handleCancelRequest, condition: (item: any) => item.status === RequestStatus.PENDING },
                { label: 'Reschedule Request', onClick: handleResceduleRequest, condition: (item: any) => item.status === RequestStatus.PENDING },
                { label: 'Transfer Request', onClick: handleTransferRequest, condition: (item: any) => item.status === RequestStatus.PENDING },
                { label: 'View Customer', onClick: handleViewCustomer },
                { label: 'Send Message', onClick: handleSendMessage },
            ]
        } else if (user?.userRole === UserRole.CUSTOMER || user?.userRole === UserRole.BUSINESS) {
            return [
                { label: 'Cancel Request', onClick: handleCancelRequest, condition: (item: any) => item.status === RequestStatus.PENDING },
            ]
        } else {
            return []
        }
    }, [user])

    const showAddRequest = useMemo(() => {
        if (!user || !user.userRole) return false
        return [UserRole.CUSTOMER, UserRole.BUSINESS, UserRole.OUTLET_MANAGER].includes(user.userRole)
    }, [user?.userRole])

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Customer Requests</h1>

                {/* Add Request Button */}
                {showAddRequest &&
                    <div className='my-2'>
                        <Button onClick={handleOpenPopup} text=' Create Request' />
                    </div>
                }

                {/* Requests Table */}
                <div className='my-2 w-1/2'>
                    <Input label='Search by Token' placeholder='Search by Token' name='token' value={searchToken}
                        onChange={onSearchToken.bind(null, 'token')} />
                </div>
                <Table columns={columns} data={filteredRequests}
                    actions={actions} />

                {/* Popup for Creating Request */}
                <Modal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <Modal.Header>Create Request</Modal.Header>
                    <Modal.Content>
                        <div className='mb-2'>
                            {
                                user?.userRole === UserRole.OUTLET_MANAGER ?
                                    <Select
                                        label='Customer/Business'
                                        value={formData.customerId}
                                        options={(customers || []).map((customer) => ({ value: String(customer._id), label: `${customer.firstName} (${customer.lastName}) - ${customer.email}` }))}
                                        onChange={handleChangeField.bind(null, 'customerId')}
                                        error={formErrors.outlet}
                                    /> :
                                    <Select
                                        label='Outlet'
                                        value={formData.outlet}
                                        options={outlets.map((outlet) => ({ value: String(outlet._id), label: `${outlet.name} (${outlet.district})` }))}
                                        onChange={handleChangeField.bind(null, 'outlet')}
                                        error={formErrors.outlet}
                                    />
                            }
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


                {
                    currentRequest && currentRequest.action === 'view' && <ViewCustomer id={currentRequest.id} onClose={() => setCurrentRequest(null)} />
                }
                {
                    currentRequest && currentRequest.action === 'sms' && <SendSMS id={currentRequest.id} onClose={() => setCurrentRequest(null)} />
                }

                {
                    currentRequest && currentRequest.action === 'rescheduler' && <Rescheduler id={currentRequest.id} min={currentRequest.item?.deadlineForPickup} onClose={() => setCurrentRequest(null)} />
                }

                {
                    currentRequest && currentRequest.action === 'transfer' && <Transfer id={currentRequest.id} onClose={() => setCurrentRequest(null)} />
                }
            </div>
        </AppLayout>
    );
}

export default AuthRoleCheck(Requests, { roles: [UserRole.BUSINESS, UserRole.CUSTOMER, UserRole.OUTLET_MANAGER] })