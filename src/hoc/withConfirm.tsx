import Button from '@/components/subcomponents/button';
import React, { useCallback, useState } from 'react';

export interface IWithConfirmProps {
    openConfirm: ({ message, actionLabel, onConfirm }: { message?: string, actionLabel?: string, onConfirm: () => void }) => void
}

interface IPopup {
    open: boolean,
    message: string
    actionLabel: string
    onConfirm: (() => void )| null
}

const withConfirm = (WrappedComponent: any) => {
    return function WithConfirmWrapper(props: any) {

        const [popup, setPopup] = useState<IPopup>({
            open: false,
            message: 'Are you sure?',
            actionLabel: 'Confirm',
            onConfirm: null
        })

        const handleConfirm = useCallback(() => {
            if (popup.onConfirm && typeof popup.onConfirm === 'function') {
                popup.onConfirm();
            }
            setPopup(popup => ({ ...popup, open: false }))
        }, [popup]);

        const openConfirm = ({ message, actionLabel, onConfirm }: { message?: string, actionLabel?: string, onConfirm: () => void }) => {
            setPopup(popup => ({
                ...popup,
                open: true,
                message: message ?? popup.message,
                actionLabel: actionLabel ?? popup.actionLabel,
                onConfirm,
            }))
        }

        return (
            <>
                <WrappedComponent {...props} openConfirm={openConfirm} />
                {popup.open && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-bold">Confirmation</h2>
                            <p className="text-gray-700 mt-2">{popup.message}</p>
                            <div className="flex justify-end mt-4 space-x-2">
                                <Button variant='outline' onClick={() => setPopup(popup => ({ ...popup, open: false }))} text='Cancel' />
                                <Button variant='solid' onClick={handleConfirm} text={popup.actionLabel} />
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };
};

export default withConfirm;
