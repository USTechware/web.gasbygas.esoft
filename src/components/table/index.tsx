'use client';

import React from 'react';

interface TableProps {
    columns: { key: string; label: string }[];
    data: Record<string, any>[];
}

export const Table: React.FC<TableProps> = ({ columns, data }) => {
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
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr
                            key={index}
                            className={`${
                                index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                            } hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200`}
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
                                >
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
