'use client';

import React from 'react';
import DropdownMenu from '../subcomponents/dropdown';
import { EditIcon } from 'lucide-react';

interface TableProps {
    columns: { key: string; label: string, render?: (item: any) => void }[];
    data: Record<string, any>[];
    actions?: { label: string, onClick: (item: any) => void, condition?: (item: any) => boolean}[]
}

export const Table: React.FC<TableProps> = ({ columns, data, actions }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide"
                            >
                                {col.label}
                            </th>
                        ))}
                        {
                            actions?.length ?

                                <th
                                    key={'action'}
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide"
                                >
                                    Action
                                </th> :
                                null
                        }
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr
                            key={index}
                            className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                                } hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200`}
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
                                >
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                            {
                                actions?.length ?
                                    <td
                                        key={'action'}
                                        className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
                                    >
                                        <DropdownMenu
                                            buttonText={
                                                <div className='w-8 flex'>
                                                    <EditIcon className='w-4 h-4'/>
                                                </div>
                                            }
                                            items={
                                                actions
                                                    .filter(action => action.condition ? action.condition(row) : true)
                                                    .map(a => ({ label: a.label, onClick: a.onClick.bind(null, row) }))} />
                                    </td> : null
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
