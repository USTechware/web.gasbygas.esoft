import React, { useEffect, useState } from 'react'
import Modal from '../modal'
import Button from '../subcomponents/button';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/data';

function ViewCustomer({ id, onClose }: { id: string, onClose: () => void }) {
    const [customer, setCustomer] = useState<any>(null);
    const dispatch = useDispatch<Dispatch>();
    useEffect(() => {

        if (id) {
            (async () => {
                const detail = await dispatch.requests.fetchCustomerDetail(id);
                if (detail?.customer) setCustomer(detail.customer)
            })()
        } else {
            setCustomer(null)
        }

    }, [id])

    if (!customer) return
    return (
        <Modal isOpen onClose={onClose}>
            <Modal.Header>View Customer</Modal.Header>
            <Modal.Content>
                <div className='flex flex-col space-y-4 p-4 bg-white rounded shadow-md'>
                    <div className='flex justify-between'>
                        <div className='font-bold'>First Name:</div>
                        <div>{customer.firstName}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='font-bold'>Last Name:</div>
                        <div>{customer.lastName}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='font-bold'>Address:</div>
                        <div>{customer.address}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='font-bold'>Email:</div>
                        <div>{customer.email}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='font-bold'>Phone Number:</div>
                        <div>{customer.phoneNumber}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='font-bold'>National ID Number:</div>
                        <div>{customer.nationalIdNumber}</div>
                    </div>
                </div>

            </Modal.Content>
            <Modal.Footer>
                <div className="flex gap-2 justify-end">
                    <Button
                        color='secondary'
                        text='Close'
                        onClick={onClose}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewCustomer