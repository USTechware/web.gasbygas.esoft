'use client';

import AuthRoleCheck from '@/components/Auth';
import AppLayout from '@/components/layouts/AppLayout';
import { Table } from '@/components/table';
import { Dispatch, RootState } from '@/data';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserRole } from '../api/types/user';
import { GasTypes, GasTypesValues } from '@/constants/common';

function Stocks() {
    const dispatch = useDispatch<Dispatch>();
    const { currentStock, stockHistory = [] } = useSelector((state: RootState) => state.outlets)

    useEffect(() => {
        dispatch.outlets.fetchStocks();
    }, [])

    const columns = [
        { key: 'dateAdded', label: 'Date Added', render: (inv: any) => moment(inv.dateAdded).format('YYYY-MM-DD') },
        { key: 'type', label: 'Type', render: ({ type: key }: { type: string }) => (GasTypesValues as any)[key] },
        { key: 'quantity', label: 'Quantity' },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200">Stocks</h1>

                {/* Current Stock Card */}
                <div className="bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-bold text-gray-700 dark:text-gray-100">Current Gas Cylinders Stock</h2>
                    {
                        currentStock &&
                        <div className="font-extrabold">
                            <table className='my-2 border-separate border border-gray-400 w-[300px]'>
                                <tbody>
                                    {Object.entries(currentStock || {}).map((item, idx) => (
                                        <tr key={idx}>
                                            <td className='border border-gray-300'>{(GasTypesValues as any)[item[0]]} Cylinders</td>
                                            <td className='border border-gray-300 text-center'>{item[1]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>

                <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Stocks History</h2>
                <Table columns={columns} data={stockHistory} />
            </div>
        </AppLayout>
    );
}

export default AuthRoleCheck(Stocks, { roles: [UserRole.OUTLET_MANAGER] })