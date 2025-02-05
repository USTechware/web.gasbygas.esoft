
import DatabaseService from "@/app/api/utils/db";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../../middleware/authenticator";
import User, { IUser } from "../../../models/user.model";
import { UserRole } from "@/app/api/types/user";

class AdminController {
    @AuthGuard()
    async GET(req: Request) {
        try {
            const userId = (req as any).userId;

            await DatabaseService.connect();
    
            // Find the user by ID
            const user: IUser | null = await User.findOne({ _id: userId });
            if (!user) {
                return NextResponse.json(
                    { message: "User not found" },
                    { status: HTTP_STATUS.BAD_REQUEST }
                );
            }

            if (user.userRole !== UserRole.ADMIN) {
                return NextResponse.json(
                    { message: "User is not admin" },
                    { status: HTTP_STATUS.UNAUTHORIZED }
                );
            }

            const customers = await User.aggregate([
                {
                    $match: {
                        userRole: { $in: [UserRole.CUSTOMER, UserRole.BUSINESS] }
                    }
                },
                {
                    $project: {
                        name: { $concat: ["$firstName", " ", "$lastName"] },
                        firstName: 1,
                        lastName: 1,
                        userRole: 1,
                        email: 1,
                        nationalIdNumber: 1,
                        businessRegId: 1,
                        businessVerificationStatus: 1,
                        businessVerificationDoc: 1,
                        phoneNumber: 1,
                        address: 1,
                        city: 1,
                        district: 1,
                    }
                }
            ]);

            return NextResponse.json(
                { customers },
                { status: HTTP_STATUS.OK }
            );
        } catch (error) {
            return NextResponse.json(
                {},
                { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
            );
        }
    }
}

export const GET = async (req: Request, res: Response) => {
    const controller = new AdminController();
    try {
        return await controller.GET(req);
    } catch (error: any) {
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
