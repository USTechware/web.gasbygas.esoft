
import DatabaseService from "@/app/api/utils/db";
import Request, { IRequest } from "@/app/api/models/request.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../../middleware/authenticator";
import User, { IUser } from "../../../models/user.model";
import SMSService from "@/app/api/lib/SMSService.lib";

class RequestsController {

    @AuthGuard()
    async POST(req: Request) {
        await DatabaseService.connect();

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

        const payload: { id: string, message: string } = await (req as any).json();

        // Ensure the request exists
        const request: IRequest | null = await Request.findById(payload.id);
        if (!request) {
            return NextResponse.json(
                { message: "Invalid request ID" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        const customer = await User.findById(request.user).select({
            phoneNumber: 1,
        });

        if (!customer?.phoneNumber) {
            return NextResponse.json(
                {
                    message: "Customer phone number not found"
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // SEND SMS
        await new SMSService().send(
            customer.phoneNumber,
            payload.message.substring(0, 100)
        )

        return NextResponse.json(
            {
                message: 'SMS is sent successfully'
            },
            { status: HTTP_STATUS.OK }
        );
    }
}

export const POST = async (req: Request, res: Response) => {
    const controller = new RequestsController();
    try {
        return await controller.POST(req);
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
