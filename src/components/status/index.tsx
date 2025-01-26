import React from 'react';

type StatusLabelProps = {
    status: 'PENDING' | 'CANCELLED' | 'PLACED' | 'CONFIRMED' | 'READY' | 'DISPATCHED' | 'ARRIVED' | 'DELIVERED' | 'COMPLETED' | 'EXPIRED';
};

const statusStyles: Record<StatusLabelProps['status'], string> = {
    PENDING: 'bg-gray-300 text-gray-700', 
    PLACED: 'bg-gray-300 text-gray-700', 
    CONFIRMED: 'bg-green-100 text-green-800',
    READY: 'bg-green-100 text-green-800',
    DISPATCHED: 'bg-green-100 text-green-800',
    ARRIVED: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
    EXPIRED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-red-200 text-red-700',
};

const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
    return (
        <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}
        >
            {status}
        </span>
    );
};

export default StatusLabel;
