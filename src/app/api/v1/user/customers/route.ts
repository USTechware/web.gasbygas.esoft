import DatabaseService from "@/app/api/utils/db";
import User from "@/app/api/models/user.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "@/app/api/middleware/authenticator";
import { UserRole } from "@/app/api/types/user";

class Controller {
    @AuthGuard()
    async get(req: Request) {
        const userId = (req as any).userId;

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            );
        }

        await DatabaseService.connect();

        // Find customers and business users list
        const customers = await User.find({
            userRole: {
                $in: [UserRole.CUSTOMER, UserRole.BUSINESS]
            }
        }).select({
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1
        });
        if (!customers) {
            return NextResponse.json(
                { message: "Customers not found" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Return the response with user
        return NextResponse.json(
            {
                customers
            },
            { status: HTTP_STATUS.OK }
        );
    }
}

export const GET = async (req: Request, res: Response) => {
    const controller = new Controller();
    try {
        return await controller.get(req);
    } catch (error: any) {
        return NextResponse.json(
            {
                message: error.message || "Unknown error",
            },
            {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            }
        );
    }
};
