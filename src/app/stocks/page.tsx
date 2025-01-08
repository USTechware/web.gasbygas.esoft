'use client';

import AuthRoleCheck from '@/components/Auth';
import AppLayout from '@/components/layouts/AppLayout';
import { Table } from '@/components/table';
import { Dispatch, RootState } from '@/data';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserRole } from '../api/types/user';

function Stocks() {
    const dispatch = useDispatch<Dispatch>();
    const { currentStock, stockHistory = [] } = useSelector((state: RootState) => state.outlets)

    useEffect(() => {
        dispatch.outlets.fetchStocks();
    }, [])

    const columns = [
        { key: 'dateAdded', label: 'Date Added', render: (inv: any) => moment(inv.dateAdded).format('YYYY-MM-DD') },
        { key: 'quantity', label: 'Quantity' },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200">Stocks</h1>

                {/* Current Stock Card */}
                <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-gray-100">Current Gas Cylinders Stock</h2>
                    <p className="text-4xl font-extrabold text-blue-700 dark:text-blue-300">{currentStock}</p>
                </div>

                {/* History Table */}
                <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Stocks History</h2>
                <Table columns={columns} data={stockHistory} />
            </div>
        </AppLayout>
    );
}

export default AuthRoleCheck(Stocks, { roles: [UserRole.OUTLET_MANAGER]})