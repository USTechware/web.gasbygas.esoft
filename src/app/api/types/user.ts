export enum UserRole {
    DISTRIBUTOR = 'DISTRIBUTOR',
    OUTLET_MANAGER = 'OUTLET_MANAGER',
    CUSTOMER = 'CUSTOMER',
    BUSINESS = 'BUSINESS'
}

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    userRole: UserRole;
    nationalIdNumber?: string;
    businessRegId?: string;
    phoneNumber: string;
    address: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}