import mongoose from "mongoose";

export interface IProduct {
    _id: string;
    name: string;
    image: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

const productSchema = new mongoose.Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        price: { type: Number, required: true, trim: true },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
