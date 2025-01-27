'use client';

import AuthRoleCheck from '@/components/Auth';
import AppLayout from '@/components/layouts/AppLayout';
import Input from '@/components/subcomponents/input';
import Button from '@/components/subcomponents/button';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@/data';
import { toast } from 'react-toastify';
import { UserRole } from '@/app/api/types/user';
import { useRouter } from 'next/navigation';
import useUser from '@/hooks/useUser';
import AreasList from '../../../../public/areas.json';
import Select from '@/components/subcomponents/select';

const ErrorFields = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    district: '',
    phoneNumber: ''
}

const DistrictsList = Object.keys(AreasList).map((d) => ({ label: d, value: d }));

const CitiesList = (district: string) => (
    ((AreasList as any)[district]?.cities || []).map((c: string) => ({ label: c, value: c }))
)

function ChangePassword() {
    const dispatch = useDispatch<Dispatch>();

    const { user, isBusiness, isCustomer } = useUser();

    const router = useRouter()

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        address: user?.address || '',
        city: user?.city || '',
        district: user?.district || '',
        phoneNumber: user?.phoneNumber || '',
    });
    const [formErrors, setFormErrors] = useState(ErrorFields);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChangeField = (field: string, value: any) => {
        let optional = {}

        if (field === 'district') {
            optional = { city: '' }
        }
        setFormData((prev) => ({
            ...prev,
            [field]: value,
            ...optional
        }));
    };

    const validateForm = () => {
        const errors = ErrorFields;
        let isValid = true;

        if (!formData.firstName) {
            errors.firstName = 'First Name is required';
            isValid = false;
        }

        if (!formData.lastName) {
            errors.lastName = 'Last Name is required';
            isValid = false;
        }

        if (!formData.address) {
            errors.address = 'Address is required';
            isValid = false;
        }

        if (!formData.city) {
            errors.city = 'City is required';
            isValid = false;
        }

        if (!formData.district) {
            errors.district = 'District is required';
            isValid = false;
        }

        if (!formData.phoneNumber || !formData.phoneNumber.match(/07[0-9]{8}/g)) {
            errors.phoneNumber = 'A Valid phone Number is required';
            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const data: any = await dispatch.auth.updateProfile(formData as any);
            toast.success(data?.message || 'Profile updated successfully');
            router.push('/dashboard')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to update profile');
            console.log('Failed to update profile:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-200">Profile</h1>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md max-w-lg mx-auto">
                    <div className="mb-4">
                        <Input
                            id="firstName"
                            type="text"
                            error={formErrors.firstName}
                            value={formData.firstName}
                            label="First Name"
                            onChange={handleChangeField.bind(null, 'firstName')}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            id="lastName"
                            type="text"
                            error={formErrors.lastName}
                            value={formData.lastName}
                            label="Last Name"
                            onChange={handleChangeField.bind(null, 'lastName')}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            id="email"
                            type="text"
                            value={user?.email || ''}
                            label="Email"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            id="address"
                            type="text"
                            error={formErrors.address}
                            value={formData.address}
                            label="Address"
                            onChange={handleChangeField.bind(null, 'address')}
                        />
                    </div>
                    <div className='mb-4'>
                        <Select label='District' value={formData.district}
                            options={DistrictsList}
                            onChange={handleChangeField.bind(null, 'district')}
                            error={formErrors.district}
                        />
                    </div>

                    <div className='mb-4'>
                        <Select label='City' value={formData.city || ''}
                            options={CitiesList(formData.district)}
                            onChange={handleChangeField.bind(null, 'city')}
                            error={formErrors.city}
                        />
                    </div>
                    {
                        isBusiness ?
                            <div className="mb-4">
                                <Input
                                    id="businessRegId"
                                    type="text"
                                    value={user?.businessRegId || ''}
                                    label="Business Registration Id"
                                    disabled
                                />
                            </div> :
                            isCustomer ?
                                <div className="mb-4">
                                    <Input
                                        id="nic"
                                        type="text"
                                        value={user?.nationalIdNumber || ''}
                                        label="NIC"
                                        disabled
                                    />
                                </div> : null
                    }
                     <div className="mb-4">
                        <Input
                            id="phoneNumber"
                            type="text"
                            error={formErrors.phoneNumber}
                            value={formData.phoneNumber}
                            label="Phone Number"
                            onChange={handleChangeField.bind(null, 'phoneNumber')}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            isLoading={isLoading}
                            text="Save Profile"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default AuthRoleCheck(ChangePassword, { roles: [] });
