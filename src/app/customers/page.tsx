'use client';

import AppLayout from '@/components/layouts/AppLayout';
import { Table } from '@/components/table';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch, RootState } from '@/data';
import AuthRoleCheck from '@/components/Auth';
import { UserRole } from '../api/types/user';
import withConfirm, { IWithConfirmProps } from '@/hoc/withConfirm';
import StatusLabel from '@/components/status';
import { BusinessVerifcationStatus } from '@/constants/common';
import CheckBox from '@/components/subcomponents/checkbox';

function Customers({ openConfirm }: IWithConfirmProps) {

    const dispatch = useDispatch<Dispatch>();

    const customers = useSelector((state: RootState) => state.customers.list);

    const [filter, setFilter] = useState({
        type: 0
    })

    useEffect(() => {
        dispatch.customers.fetchCustomers();
        // @ts-ignore react-hooks/exhaustive-deps
    }, [])

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'district', label: 'District' },
        { key: 'city', label: 'City' },
        { key: 'address', label: 'Address' },
        { key: 'userRole', label: 'Type' },
        {
            key: 'isBusinessVerfied', label: 'Verification Status', render: ({ businessVerificationStatus }: { businessVerificationStatus: BusinessVerifcationStatus }) =>
                businessVerificationStatus ? <StatusLabel status={businessVerificationStatus} /> : '--'
        }
    ];

    const onUpdateStatus = (action: string, status: BusinessVerifcationStatus, item: any) => {
        openConfirm({
            message: `Are you sure to ${action} this business?`,
            actionLabel: 'Confirm',
            onConfirm: () => {
                dispatch.customers.updateBusinessStatus({
                    _id: item._id,
                    status
                })
            }
        })
    }

    const onViewDocument = (item: any) => {
        window.open(item.businessVerificationDoc)
    }

    const onChangeTypeFilter = (t: number, checked: boolean) => {
        setFilter(filter => ({
            ...filter,
            type: t
        }))
    }

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            if(filter.type === 0) return c
            if(filter.type === 1) return c.userRole === UserRole.BUSINESS
            if(filter.type === 2) return c.userRole === UserRole.CUSTOMER
        })
    }, [filter, customers])

    return (
        <AppLayout>
            <div className="bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Customers</h1>
                <div className='flex gap-2 my-2'>
                    <CheckBox id='' label='All' checked={filter.type === 0} onChange={onChangeTypeFilter.bind(null, 0)} />
                    <CheckBox id='' label='Business' checked={filter.type === 1} onChange={onChangeTypeFilter.bind(null, 1)} />
                    <CheckBox id='' label='Individual' checked={filter.type === 2} onChange={onChangeTypeFilter.bind(null, 2)} />
                </div>
                <Table columns={columns} data={filteredCustomers}
                    actions={[
                        { label: 'View Document', onClick: onViewDocument, condition: (row: any) => row.userRole === UserRole.BUSINESS },
                        {
                            label: 'Approve Business', onClick: onUpdateStatus.bind(null, 'approve', BusinessVerifcationStatus.VERIFIED),
                            condition: (row: any) => row.userRole === UserRole.BUSINESS
                                && [BusinessVerifcationStatus.DENIED, BusinessVerifcationStatus.PENDING].includes(row.businessVerificationStatus)
                        },
                        {
                            label: 'Deny Business', onClick: onUpdateStatus.bind(null, 'reject', BusinessVerifcationStatus.DENIED),
                            condition: (row: any) => row.userRole === UserRole.BUSINESS 
                            && [BusinessVerifcationStatus.VERIFIED, BusinessVerifcationStatus.PENDING].includes(row.businessVerificationStatus)
                        }
                    ]}
                />
            </div>
        </AppLayout>
    );
}

export default AuthRoleCheck(withConfirm(Customers), { roles: [UserRole.ADMIN] })