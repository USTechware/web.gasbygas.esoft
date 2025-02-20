import mongoose, { Schema, Document } from "mongoose";

interface IStockHistory{
    dateAdded: Date;
    quantity: number;
    productId: Schema.Types.ObjectId | string;
}

export interface IOutlet extends Document {
    name: string;
    district: string;
    city: string;
    address: string;
    managerName: string;
    managerEmail: string;
    managerPhoneNumber: string;
    currentStock: Schema.Types.Mixed;
    stockHistory: IStockHistory[]
    isActive: boolean
}

const outletSchema = new Schema<IOutlet>(
    {
        name: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        managerName: { type: String, required: true, trim: true },
        managerEmail: { type: String, required: true, unique: true, trim: true },
        managerPhoneNumber: { type: String, required: true, trim: true },
        currentStock: { type: Schema.Types.Mixed, required: true},
        stockHistory: { type: Schema.Types.Mixed, required: true, trim: true },
        isActive: { type: Schema.Types.Boolean, required: false, default: true, trim: true },
    },
    { timestamps: true }
);

export default mongoose.models.Outlet || mongoose.model<IOutlet>("Outlet", outletSchema);
