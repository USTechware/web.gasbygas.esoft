import React, { useState } from 'react';
import Modal from '../modal';
import Button from '../subcomponents/button';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/data';
import TextArea from '../subcomponents/textarea';
import { toast } from 'react-toastify';
import Input from '../subcomponents/input';
import moment from 'moment';

interface ReschedulerProps {
    id: string;
    min: string;
    onClose: () => void;
}

const Rescheduler: React.FC<ReschedulerProps> = ({ id, min, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [deadlineForPickup, setDeadlineForPickup] = useState(moment(min).add(1, 'd').format('YYYY-MM-DD'));
    const dispatch = useDispatch<Dispatch>();

    const reschedule = async () => {
        if (!id || !deadlineForPickup) {
            toast.error('Please fill in all the fields.');
            return;
        }

        setIsLoading(true);
        try {
            await dispatch.requests.rescheduleRequest({ _id: id, message, deadlineForPickup });
            toast.success('Reschedule request sent successfully!');
            onClose();
        } catch (error) {
            toast.error('Failed to send reschedule request.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeField = (field: string, val: any) => {
        if (field === 'message') setMessage(val)
        if (field === 'deadlineForPickup') setDeadlineForPickup(val)
    };

    return (
        <Modal isOpen onClose={onClose}>
            <Modal.Header>Reschedule Pickup</Modal.Header>
            <Modal.Content>
                <div className="flex flex-col space-y-4 p-4 bg-white rounded shadow-md">
                    <div className="flex flex-col space-y-2">
                        <Input type='date' min={moment(min).add(1, 'd').format('YYYY-MM-DD')}
                            label='Deadline for Pickup'
                            value={deadlineForPickup}
                            onChange={handleChangeField.bind(null, 'deadlineForPickup')} />
                    </div>
                    <TextArea
                        id="rescheduleMessage"
                        placeholder="Enter message"
                        maxLength={100}
                        label="Message"
                        value={message}
                        onChange={handleChangeField.bind(null, 'message')} />
                </div>
            </Modal.Content>
            <Modal.Footer>
                <div className="flex gap-2 justify-end">
                    <Button
                        color="primary"
                        text="Reschedule"
                        isLoading={isLoading}
                        onClick={reschedule}
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

export default Rescheduler;
