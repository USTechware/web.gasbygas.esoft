import mongoose, { Schema, Document, Types } from "mongoose";
import { DeliveryStatus } from "../types/deliveries";

export interface IDelivery extends Document {
    outlet: Types.ObjectId;
    quantity: number;
    dateOfDelivery: Date;
    status: DeliveryStatus;
}

const deliverySchema = new Schema<IDelivery>(
    {
        outlet: { type: Schema.Types.ObjectId, required: true, ref: "Outlet" },
        quantity: { type: Number, required: true },
        dateOfDelivery: { type: Date, required: true },
        status: {
            type: String,
            required: true,
            enum: Object.keys(DeliveryStatus),
            default: DeliveryStatus.PENDING
        }
    },
    { timestamps: true }
);

export default mongoose.models.Delivery || mongoose.model<IDelivery>("Delivery", deliverySchema);
