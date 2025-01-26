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
import { GasTypes, GasTypesValues } from '@/constants/common';
import CheckBox from '@/components/subcomponents/checkbox';
import TimelineView from '@/components/Timeline';

function Requests() {
    const dispatch = useDispatch<Dispatch>();
    const { user, isCustomer, isBusiness, isOutletManager } = useUser()
    const requests = useSelector((state: RootState) => state.requests.list);
    const outlets = useSelector((state: RootState) => state.outlets.list);
    const customers = useSelector((state: RootState) => state.outlets.customers);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isExistingCustomer, setIsExistingCustomer] = useState<boolean>(true);

    useEffect(() => {

        if (isOutletManager) {
            dispatch.outlets.fetchCustomers()
        }

    }, [isOutletManager])

    const [currentRequest, setCurrentRequest] = useState<{ id: string, item: any, action: 'view' | 'sms' | 'timeline' | 'rescheduler' | 'transfer' } | null>(null)

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
        customerName: '',
        customerEmail: '',
        customerPhoneNumber: '',
        customerAddress: '',
        outlet: '',
        type: GasTypes.TWO_KG,
        quantity: 0,
    });

    const [formErrors, setFormErrors] = useState({
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhoneNumber: '',
        customerAddress: '',
        outlet: '',
        type: '',
        quantity: '',
    });

    const columns = [
        { key: 'token', label: 'Token' },
        { key: 'outlet', label: 'Outlet', render: (request: any) => `${request.outlet.name}` },
        { key: 'type', label: 'Type', render: (request: any) => (GasTypesValues as any)[request.type] },
        { key: 'quantity', label: 'Quantity' },
        {
            key: 'status', label: 'Status', render: (request: any) => <StatusLabel status={request.status} />
        },
    ];

    if (isOutletManager) {
        columns.splice(
            1,
            1,
            {
                key: 'user', label: 'Customer/Business', render: (request: any) =>
                    request.user ? `${request.user.firstName} ${request.user.lastName}` :
                        `${request.customerName}/${request.customerEmail}`
            },
        )
    }

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setFormData({
            customerId: null,
            customerName: '',
            customerEmail: '',
            customerPhoneNumber: '',
            customerAddress: '',
            outlet: '',
            type: GasTypes.TWO_KG,
            quantity: 0,
        });
        setFormErrors({
            customerId: '',
            customerName: '',
            customerEmail: '',
            customerPhoneNumber: '',
            customerAddress: '',
            outlet: '',
            type: '',
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
            customerName: '',
            customerEmail: '',
            customerPhoneNumber: '',
            customerAddress: '',
            outlet: '',
            type: '',
            quantity: '',
        };
        let isValid = true;

        if ((isCustomer || isBusiness) && !formData.outlet) {
            errors.outlet = 'Outlet is required';
            isValid = false;
        }

        if (isOutletManager && isExistingCustomer && !formData.customerId) {
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
                type: formData.type,
                quantity: formData.quantity,
                customerId: undefined,
                outlet: undefined
            }
            if (isOutletManager) {


                if (isExistingCustomer) {
                    payload.customerId = formData.customerId
                } else {
                    payload.customerName = formData.customerName
                    payload.customerEmail = formData.customerEmail
                    payload.customerPhoneNumber = formData.customerPhoneNumber
                    payload.customerAddress = formData.customerAddress
                }
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
    const handleViewTimeline = async (item: any) => {
        setCurrentRequest({ id: item._id, item, action: 'timeline' })
    }

    const actions = useMemo(() => {
        if (isOutletManager) {
            return [
                { label: 'Issue Request', onClick: handleIssueRequest, condition: (item: any) => ![RequestStatus.DELIVERED, RequestStatus.CANCELLED, RequestStatus.EXPIRED].includes(item.status) },
                { label: 'Expire Request', onClick: handleExpireRequest, condition: (item: any) => ![RequestStatus.DELIVERED, RequestStatus.CANCELLED, RequestStatus.EXPIRED].includes(item.status) },
                { label: 'Cancel Request', onClick: handleCancelRequest, condition: (item: any) => ![RequestStatus.DELIVERED, RequestStatus.CANCELLED, RequestStatus.EXPIRED].includes(item.status) },
                { label: 'Reschedule Request', onClick: handleResceduleRequest, condition: (item: any) => item.status === RequestStatus.EXPIRED },
                { label: 'Transfer Request', onClick: handleTransferRequest, condition: (item: any) => ![RequestStatus.DELIVERED, RequestStatus.CANCELLED, RequestStatus.EXPIRED].includes(item.status) },
                { label: 'View Customer', onClick: handleViewCustomer },
                { label: 'Send Message', onClick: handleSendMessage },
                { label: 'View Timeline', onClick: handleViewTimeline },
            ]
        } else if (isBusiness || isCustomer) {
            return [
                { label: 'Cancel Request', onClick: handleCancelRequest, condition: (item: any) => item.status === RequestStatus.PLACED },
                { label: 'View Timeline', onClick: handleViewTimeline },
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
                        {
                            isOutletManager &&
                            <div className='mb-2'>
                                <CheckBox id='' label='Is Existing Customer' checked={isExistingCustomer} onChange={(value: boolean) => setIsExistingCustomer(value)} />
                            </div>
                        }
                        <div className='mb-2'>
                            {
                                isOutletManager ?

                                    isExistingCustomer ?
                                        <Select
                                            label='Customer/Business'
                                            value={formData.customerId}
                                            options={(customers || []).map((customer) => ({ value: String(customer._id), label: `${customer.firstName} (${customer.lastName}) - ${customer.email}` }))}
                                            onChange={handleChangeField.bind(null, 'customerId')}
                                            error={formErrors.outlet}
                                        /> :
                                        <>
                                            <div className='mb-2'>
                                                <Input
                                                    label='Customer Name'
                                                    type='text'
                                                    value={formData.customerName}
                                                    onChange={handleChangeField.bind(null, 'customerName')}
                                                    error={formErrors.customerName}
                                                />
                                            </div>
                                            <div className='mb-2'>
                                                <Input
                                                    label='Customer Email'
                                                    type='text'
                                                    value={formData.customerEmail}
                                                    onChange={handleChangeField.bind(null, 'customerEmail')}
                                                    error={formErrors.customerEmail}
                                                />
                                            </div>
                                            <div className='mb-2'>
                                                <Input
                                                    label='Customer PhoneNumber'
                                                    type='text'
                                                    value={formData.customerPhoneNumber}
                                                    onChange={handleChangeField.bind(null, 'customerPhoneNumber')}
                                                    error={formErrors.customerPhoneNumber}
                                                />
                                            </div>
                                            <div className='mb-2'>
                                                <Input
                                                    label='Customer Address'
                                                    type='text'
                                                    value={formData.customerAddress}
                                                    onChange={handleChangeField.bind(null, 'customerAddress')}
                                                    error={formErrors.customerAddress}
                                                />
                                            </div>
                                        </>

                                    :
                                    <Select
                                        label='Outlet'
                                        value={formData.outlet}
                                        options={outlets.map((outlet) => ({ value: String(outlet._id), label: `${outlet.name} (${outlet.district})` }))}
                                        onChange={handleChangeField.bind(null, 'outlet')}
                                        error={formErrors.outlet}
                                    />
                            }
                        </div>
                        <div className="mb-2">
                            <Select
                                error={formErrors.type}
                                options={Object.keys(GasTypes).map((key: string) => ({ label: (GasTypesValues as any)[key], value: key }))}
                                value={formData.type} label='Type' onChange={handleChangeField.bind(null, 'type')} />

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
                {
                    currentRequest && currentRequest.action === 'timeline' && <TimelineView events={currentRequest.item.timelines} onClose={() => setCurrentRequest(null)} />
                }
            </div>
        </AppLayout>
    );
}

export default AuthRoleCheck(Requests, { roles: [UserRole.BUSINESS, UserRole.CUSTOMER, UserRole.OUTLET_MANAGER] })