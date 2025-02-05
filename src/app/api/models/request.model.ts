import mongoose, { Schema, Types, Document } from "mongoose";
import { RequestStatus } from "../types/requests";

export interface ITimeline {
    date: string;
    status: RequestStatus;
}

export interface IRequest extends Document {
    outlet: Types.ObjectId;
    user?: Types.ObjectId;
    customerName?: String,
    customerEmail?: String,
    customerPhoneNumber?: String,
    customerAddress?: String,
    productId: Types.ObjectId;
    quantity: Number;
    deadlineForPickup: String
    token: String
    timelines: ITimeline[]
    total: number;
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
            required: false,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: false,
        },
        customerName: {
            type: String,
            required: false,
        },
        customerEmail: {
            type: String,
            required: false,
        },
        customerPhoneNumber: {
            type: String,
            required: false,
        },
        customerAddress: {
            type: String,
            required: false,
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
        timelines: {
            type: [
                {
                    date: { type: String },
                    status: {
                        type: String,
                        required: true,
                        enum: Object.keys(RequestStatus)
                    }
                }
            ]
        },
        total: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.keys(RequestStatus),
            default: RequestStatus.PLACED
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
