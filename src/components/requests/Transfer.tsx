import React, { useState } from 'react';
import Modal from '../modal';
import Button from '../subcomponents/button';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/data';
import { toast } from 'react-toastify';
import Select from '../subcomponents/select';

interface ReschedulerProps {
    id: string;
    onClose: () => void;
}

const Transfer: React.FC<ReschedulerProps> = ({ id, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [outlet, setOutlet] = useState('');
    
    const user = useSelector((state: RootState) => state.auth.user);
    const outlets = useSelector((state: RootState) => state.outlets.list);
    const dispatch = useDispatch<Dispatch>();

    const transfer = async () => {
        if (!id || !outlet) {
            toast.error('Please fill in all the fields.');
            return;
        }

        setIsLoading(true);
        try {
            await dispatch.requests.transfer({ _id: id, outlet });
            toast.success('Request has been transferred successfully!');
            onClose();
        } catch (error) {
            toast.error('Failed to transfer request.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeField = (field: string, val: any) => {
        if (field === 'outlet') setOutlet(val)
    };

    return (
        <Modal isOpen onClose={onClose}>
            <Modal.Header>Transfer</Modal.Header>
            <Modal.Content>
                <div className="flex flex-col space-y-4 p-4 bg-white rounded shadow-md">
                    <div className="flex flex-col space-y-2">
                        <Select
                            label='Outlet'
                            value={outlet}
                            options={outlets
                                .filter(o => o._id !== user?.outlet)
                                .map((outlet) => ({ value: String(outlet._id), label: `${outlet.name} (${outlet.district})` }))}
                            onChange={handleChangeField.bind(null, 'outlet')}
                        />
                    </div>
                </div>
            </Modal.Content>
            <Modal.Footer>
                <div className="flex gap-2 justify-end">
                    <Button
                        color="primary"
                        text="Transfer"
                        isLoading={isLoading}
                        onClick={transfer}
                    />
                    <Button
                        color="secondary"
                        text="Close"
                        onClick={onClose}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default Transfer;
