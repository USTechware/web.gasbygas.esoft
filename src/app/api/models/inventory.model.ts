import { GasTypes } from "@/constants/common";
import mongoose, { Schema, Document, Types } from "mongoose";


interface IInventoryHistory {
    dateAdded: Date;
    quantity: number;
    type: GasTypes
}

interface ICurrentStock{
    [GasTypes.TWO_KG]: number;
    [GasTypes.FIVE_KG]: number;
    [GasTypes.TWELVE_HALF_KG]: number;
    [GasTypes.SIXTEEN_KG]: number;
}
interface IInventory extends Document {
    currentStock: ICurrentStock;
    history: IInventoryHistory[];
}


const inventoryHistorySchema = new Schema<IInventoryHistory>(
    {
        dateAdded: { type: Date, required: true, default: Date.now },
        quantity: { type: Number, required: true },
        type: {
            type: String,
            required: true,
            enum: Object.keys(GasTypes),
            default: GasTypes.TWO_KG
        },
    },
    { _id: false }
);

const inventorySchema = new Schema<IInventory>(
    {
        currentStock: { type: Schema.Types.Mixed, required: true, default: 0 },
        history: { type: [inventoryHistorySchema], required: true, default: [] }
    },
    { timestamps: true }
);

export default mongoose.models.Inventory || mongoose.model<IInventory>("Inventory", inventorySchema);
