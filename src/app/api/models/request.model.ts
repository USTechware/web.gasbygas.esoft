import mongoose, { Schema, Types, Document } from "mongoose";
import { RequestStatus } from "../types/requests";


export interface IRequest extends Document {
    outlet: Types.ObjectId;
    user: Types.ObjectId;
    quantity: Number;
    deadlineForPickup: String
    token: String
    status: RequestStatus
}

const RequestSchema = new mongoose.Schema<IRequest>(
    {
        outlet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Outlet',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        deadlineForPickup: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.keys(RequestStatus),
            default: RequestStatus.PENDING
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
