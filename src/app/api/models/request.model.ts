import mongoose, { Schema, Types, Document } from "mongoose";
import { RequestStatus } from "../types/requests";
import { GasTypes } from "@/constants/common";

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
    type: GasTypes;
    quantity: Number;
    deadlineForPickup: String
    token: String
    timelines: ITimeline[]
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
        type: {
            type: String,
            required: true,
            enum: Object.keys(GasTypes),
            default: GasTypes.TWO_KG
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
