import mongoose, { Schema, Document } from "mongoose";

interface IOutlet extends Document {
    name: string;
    district: string;
    city: string;
    address: string;
    managerName: string;
    managerEmail: string;
    managerPhoneNumber: string;
}

const outletSchema = new Schema<IOutlet>(
    {
        name: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        managerName: { type: String, required: true, trim: true },
        managerEmail: { type: String, required: true, unique: true, trim: true },
        managerPhoneNumber: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

export default mongoose.models.Outlet || mongoose.model<IOutlet>("Outlet", outletSchema);
