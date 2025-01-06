import React from 'react';

type StatusLabelProps = {
    status: 'PENDING' | 'DELIVERED' | 'COMPLETED' | 'EXPIRED';
};

const statusStyles: Record<StatusLabelProps['status'], string> = {
    PENDING: 'bg-gray-200 text-gray-700', 
    DELIVERED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
    EXPIRED: 'bg-red-100 text-red-800',
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
