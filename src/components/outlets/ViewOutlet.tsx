import React, { useEffect, useState } from 'react';
import Modal from '../modal';
import Button from '../subcomponents/button';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/data';
import { GasTypesValues } from '@/constants/common';

function ViewOutlet({ id, onClose }: { id: string; onClose: () => void }) {
    const [outlet, setOutlet] = useState<any>(null);
    const dispatch = useDispatch<Dispatch>();

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    const detail = await dispatch.outlets.fetchOutletDetail(id);
                    if (detail?.outlet) setOutlet(detail.outlet);
                } catch (error) {
                    console.error('Failed to fetch outlet details:', error);
                }
            })();
        } else {
            setOutlet(null);
        }
    }, [id, dispatch]);

    if (!outlet) return null;

    return (
        <Modal isOpen onClose={onClose}>
            <Modal.Header>View Outlet</Modal.Header>
            <Modal.Content>
                <div className='flex gap-2 gap-x-8 p-2 text-sm'>

                    <div className="flex flex-col">
                        <div className="font-bold text-md text-gray-400 mb-4">Details</div>
                        <div className="flex flex-col space-y-2">
                            <div className="flex justify-between">
                                <div className="font-bold">Outlet Name: </div>
                                <div>{outlet.outletDetails.name}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="font-bold">Address: </div>
                                <div>{outlet.outletDetails.address}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="font-bold">City: </div>
                                <div>{outlet.outletDetails.city}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="font-bold">District: </div>
                                <div>{outlet.outletDetails.district}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="font-bold">Manager: </div>
                                <div>{outlet.outletDetails.managerName}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="font-bold">Email: </div>
                                <div>{outlet.outletDetails.managerEmail}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="font-bold">PhoneNumber: </div>
                                <div>{outlet.outletDetails.managerPhoneNumber}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col">
                            <div className="font-bold text-md text-gray-400 mb-4">Requests</div>
                            <div className="flex flex-col space-y-2">
                                <div className="flex justify-between">
                                    <div className="font-bold">Pending: </div>
                                    <div>{outlet.requests?.pending || 0}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="font-bold">Completed: </div>
                                    <div>{outlet.requests?.completed || 0}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="font-bold">Expired: </div>
                                    <div>{outlet.requests?.expired || 0}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col mt-4">
                            <div className="font-bold text-md text-gray-400 mb-4">Stocks</div>
                            <div className="flex flex-col justify-between">
                                <div className="font-bold">Current Stocks:</div>
                                <div className='w-full'>
                                    {
                                        Object.entries(outlet.stocks?.current || {}).map((item: any, idx) => (
                                            <div key={idx} className=' flex justify-between'><span>{(GasTypesValues as any)[item[0]]}</span> <span>{item[1]}</span></div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Content>
            <Modal.Footer>
                <div className="flex gap-2 justify-end">
                    <Button color="secondary" text="Close" onClick={onClose} />
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default ViewOutlet;
