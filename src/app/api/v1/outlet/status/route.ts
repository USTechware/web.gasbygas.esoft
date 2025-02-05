import DatabaseService from "@/app/api/utils/db";
import Outlet from "@/app/api/models/outlet.model";
import User, { IUser } from "@/app/api/models/user.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextRequest, NextResponse } from "next/server";
import { AuthGuard } from "../../../middleware/authenticator";
import { UserRole } from "@/app/api/types/user";

class OutletController {
    @AuthGuard()
    async PUT(req: NextRequest) {
        await DatabaseService.connect();

        const userId = (req as any).userId;

        // Fetch user
        const user: IUser | null = await User.findById(userId);
        if (!(user && user.userRole === UserRole.ADMIN)) {
            return NextResponse.json(
                {
                    message: "Admin User not found",
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            );
        }

        const { id, isActive } = await req.json();

        // Fetch the outlet details
        const outlet = await Outlet.findOne({
            _id: id
        }).select({ _id: 1, isActive: 1 });

        if (!outlet) {
            return NextResponse.json(
                {
                    message: "Outlet not found",
                },
                { status: HTTP_STATUS.NOT_FOUND }
            );
        }

        outlet.isActive = isActive;
        await outlet.save();

        return NextResponse.json({ 
            message: 'Outlet status has been updated successfully'
         }, { status: HTTP_STATUS.OK });
    }
}

// API route handler for the PUT request
export const PUT = async (req: NextRequest) => {
    const controller = new OutletController();
    try {
        return await controller.PUT(req);
    } catch (error: any) {
        console.error("ERROR:", error);
        return NextResponse.json(
            {
                message: error.message || "Unknown error"
            },
            {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR
            }
        );
    }
};
