import mongoose, { Schema, Document, Types } from "mongoose";


interface IInventoryHistory {
    dateAdded: Date;
    quantity: number;
    productId: Types.ObjectId | string
}

interface IInventory extends Document {
    currentStock: Schema.Types.Mixed;
    history: IInventoryHistory[];
}


const inventoryHistorySchema = new Schema<IInventoryHistory>(
    {
        dateAdded: { type: Date, required: true, default: Date.now },
        quantity: { type: Number, required: true },
        productId: {
            type: String,
            required: true,
            ref: 'Product'
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
