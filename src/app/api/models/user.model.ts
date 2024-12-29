import mongoose from "mongoose";
import { IUser } from "@/app/api/types/user";

const userSchema = new mongoose.Schema<IUser>(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        userRole: { type: String, required: true, trim: true },
        password: { type: String, required: true },
        nationalIdNumber: { type: String, required: false },
        businessRegId: { type: String, required: false },
        phoneNumber: { type: String, required: false },
        address: { type: String, required: false }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
