import mongoose from "mongoose";
import { UserRole } from "../types/user";

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    userRole: UserRole;
    nationalIdNumber?: string;
    businessRegId?: string;
    phoneNumber: string;
    district: string;
    city: string;
    address: string;
    password: string;
    outlet?: string;
    requestChangePassword?: boolean;
    createdAt: string;
    updatedAt: string;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        userRole: { type: String, required: true, trim: true },
        password: { type: String, required: true },
        nationalIdNumber: { type: String, required: false },
        businessRegId: { type: String, required: false },
        phoneNumber: { type: String, required: false },
        district: { type: String, required: false },
        city: { type: String, required: false },
        address: { type: String, required: false },
        requestChangePassword: { type: Boolean, required: false },
        outlet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Outlet',
            required: false,
        },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
