import mongoose, { Schema, Document, Types } from "mongoose";
import { DeliveryStatus } from "../types/deliveries";
import { GasTypes } from "@/constants/common";

export interface IRequestItem {
    type: GasTypes;
    quantity: number
}

export interface ITimeline {
    date: string;
    status: DeliveryStatus;
}

export interface IDelivery extends Document {
    outlet: Types.ObjectId;
    items: IRequestItem[];
    status: DeliveryStatus;
    timelines: ITimeline[]
}

const deliverySchema = new Schema<IDelivery>(
    {
        outlet: { type: Schema.Types.ObjectId, required: true, ref: "Outlet" },
        items: {
            type: [{
                type: { type: String, enum: Object.values(GasTypes), required: true },
                quantity: { type: Number, required: true }
            }],
            required: true
        },
        timelines: {
            type: [
                {
                    date: { type: String },
                    status: {
                        type: String,
                        required: true,
                        enum: Object.keys(DeliveryStatus)
                    }
                }
            ]
        },
        status: {
            type: String,
            required: true,
            enum: Object.keys(DeliveryStatus),
            default: DeliveryStatus.PLACED
        }
    },
    { timestamps: true }
);

export default mongoose.models.Delivery || mongoose.model<IDelivery>("Delivery", deliverySchema);
