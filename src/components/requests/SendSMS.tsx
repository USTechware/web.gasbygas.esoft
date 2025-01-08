import React, { useEffect, useState } from 'react'
import Modal from '../modal'
import Button from '../subcomponents/button';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/data';
import TextArea from '../subcomponents/textarea';
import { toast } from 'react-toastify';

function SendSMS({ id, onClose }: { id: string, onClose: () => void }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const dispatch = useDispatch<Dispatch>();
    const sendSMS = async () => {
        if (id && message) {
            setIsLoading(true)
            await dispatch.requests.sendSMS({ id, message });
            onClose()
            toast.success("SMS is sent successfully")
            setIsLoading(false)
        }

    }

    const onChangeMessage = (value: any) => {
        setMessage(value)
    }

    return (
        <Modal isOpen onClose={onClose}>
            <Modal.Header>Send SMS</Modal.Header>
            <Modal.Content>
                <div className='flex flex-col space-y-4 p-4 bg-white rounded shadow-md'>
                    <div className='flex justify-between'>
                        <TextArea id=''
                            placeholder='SMS content'
                            maxLength={100}
                            label='Message' value={message} onChange={onChangeMessage} />
                    </div>
                </div>

            </Modal.Content>
            <Modal.Footer>
                <div className="flex gap-2 justify-end">
                    <Button
                        color='primary'
                        text='Send'
                        isLoading={isLoading}
                        onClick={sendSMS}
                    />
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

export default SendSMS