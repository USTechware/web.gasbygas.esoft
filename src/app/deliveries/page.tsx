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
import useUser from '@/hooks/useUser';
import { GasTypes, GasTypesValues } from '@/constants/common';
import { IRequestItem } from '../api/models/deliveries.model';
import TimelineView from '@/components/Timeline';


function Deliveries() {
    const dispatch = useDispatch<Dispatch>();
    const { user, isOutletManager, isAdmin } = useUser();
    const deliveries = useSelector((state: RootState) => state.deliveries.list);

    const [currentDelivery, setCurrentDelivery] = useState<{ id: string, item: any, action: 'timeline' } | null>(null)

    useEffect(() => {
        dispatch.outlets.fetchOutlets();
        dispatch.deliveries.fetchDeliveries();
    }, [dispatch]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [item, setItem] = useState<IRequestItem>({
        type: GasTypes.TWO_KG,
        quantity: 1
    })

    const [formData, setFormData] = useState<{ items: IRequestItem[] }>({
        items: []
    });

    const columns = [
        { key: 'outlet', label: 'Outlet', render: (delivery: any) => `${delivery.outlet.name}/${delivery.outlet.district}` },
        {
            key: 'order', label: 'Order Items', render: ((delivery: any) => {
                return delivery.items.map((d: any) => (
                    <div key={d.type}>{(GasTypesValues as any)[d.type]}: {d.quantity}</div>
                ))
            })
        },
        { key: 'lastUpdatedAt', label: 'Last Updated At', render: (delivery: any) => moment(delivery.updatedAt).format('YYYY-MM-DD HH:MM') },
        { key: 'status', label: 'Status', render: (request: any) => <StatusLabel status={request.status} /> }
    ];

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setItem({
            quantity: 1,
            type: GasTypes.TWO_KG
        });
        setIsPopupOpen(false);
    };

    const handleChangeField = (field: string, val: any) => {
        setItem(prev => ({
            ...prev,
            [field]: field === 'quantity' ? parseInt(val) : val,
        }));
    };

    const validateForm = () => {
        let isValid = true;

        if (!formData.items?.length) {
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const data = await dispatch.deliveries.createDelivery({ items: formData.items });
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


    const handleUpdateStatus = async (status: DeliveryStatus, item: any) => {
        try {
            const data = await dispatch.deliveries.confirmDelivery({ _id: item._id, status });
            toast.success(data?.message || "Delivery has been updated successfully");
            dispatch.deliveries.fetchDeliveries();
            handleClosePopup();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unknown error occurred!");
            console.log('Create delivery failed:', error);
        }
    }

    const handleViewTimeline = async (item: any) => {
        setCurrentDelivery({ id: item._id, item, action: 'timeline' })
    }

    const actions = useMemo(() => {
        if (isAdmin) {
            return [
                { label: 'Confirm', onClick: handleUpdateStatus.bind(null, DeliveryStatus.CONFIRMED), condition: (item: any) => item.status === DeliveryStatus.PLACED },
                { label: 'Make Ready', onClick: handleUpdateStatus.bind(null, DeliveryStatus.READY), condition: (item: any) => item.status === DeliveryStatus.CONFIRMED },
                { label: 'Dispatch', onClick: handleUpdateStatus.bind(null, DeliveryStatus.DISPATCHED), condition: (item: any) => item.status === DeliveryStatus.READY },
                { label: 'Cancel', onClick: handleUpdateStatus.bind(null, DeliveryStatus.CANCELLED), condition: (item: any) => item.status === DeliveryStatus.PLACED },
                { label: 'View Timeline', onClick: handleViewTimeline },
            ]
        } else if (isOutletManager) {
            return [
                { label: 'Confirm Arrival', onClick: handleUpdateStatus.bind(null, DeliveryStatus.ARRIVED), condition: (item: any) => item.status === DeliveryStatus.DISPATCHED },
                { label: 'Cancel', onClick: handleUpdateStatus.bind(null, DeliveryStatus.CANCELLED), condition: (item: any) => item.status === DeliveryStatus.PLACED },
                { label: 'View Timeline', onClick: handleViewTimeline },
            ]
        } else {
            return []
        }
    }, [user])

    const onAddItem = () => {
        if (item && item.type && item.quantity) {
            setFormData((prev) => {
                const existingItemIndex = (prev.items || []).findIndex((i) => i.type === item.type);

                if (existingItemIndex !== -1) {
                    return {
                        ...prev,
                        items: prev.items.map((i, index) =>
                            index === existingItemIndex
                                ? { ...i, quantity: item.quantity }
                                : i
                        ),
                    };
                } else {
                    return {
                        ...prev,
                        items: [...(prev.items || []), item],
                    };
                }
            });
        }
    };
    const onRemoveItem = (type: GasTypes) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.type !== type),
        }));
    };
    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Delivery Requests</h1>

                {/* Request Delivery Button */}
                {isOutletManager &&
                    <div className='my-2'>
                        <Button
                            text='Request Delivery'
                            onClick={handleOpenPopup}
                        />
                    </div>
                }

                {/* Deliveries Table */}
                <Table columns={columns} data={deliveries} actions={actions} />

                <Modal isOpen={isPopupOpen} onClose={handleClosePopup}>
                    <Modal.Header>Request Delivery</Modal.Header>
                    <Modal.Content>
                        <div className="mb-2 flex gap-2 justify-between items-end">
                            <Select
                                options={Object.keys(GasTypes).map((key: string) => ({ label: (GasTypesValues as any)[key], value: key }))}
                                value={item.type || ''} label='Type' onChange={handleChangeField.bind(null, 'type')} />

                            <Input
                                label='Quantity'
                                type='number'
                                min={0}
                                value={item.quantity}
                                onChange={handleChangeField.bind(null, 'quantity')}
                            />
                            <Button onClick={onAddItem} className='h-[40px]' text='Add' />
                        </div>

                        <div className="max-w-md bg-white/2 shadow-lg rounded-md">
                            {formData.items?.length ? (
                                <div className="space-y-2">
                                    {formData.items.map((item) => (
                                        <div
                                            key={item.type}
                                            className="flex items-center justify-between p-2 border rounded-lg bg-gray-50 hover:bg-gray-100"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-700">{(GasTypesValues as any)[item.type]}</div>
                                                <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                                            </div>
                                            <Button
                                                text=' Remove'
                                                className="bg-red-500 hover:bg-red-600 rounded-lg shadow-sm"
                                                onClick={onRemoveItem.bind(null, item.type)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500 text-center mt-4 pb-2">Please add request items.</div>
                            )}
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

                {
                    currentDelivery && currentDelivery.action === 'timeline' && <TimelineView events={currentDelivery.item.timelines} onClose={() => setCurrentDelivery(null)} />
                }
            </div>
        </AppLayout>
    );
}

export default AuthRoleCheck(Deliveries, { roles: [UserRole.ADMIN, UserRole.OUTLET_MANAGER] })