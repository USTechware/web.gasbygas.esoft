
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Delivery, { IDelivery } from "@/app/api/models/deliveries.model";
import Outlet, { IOutlet } from "@/app/api/models/outlet.model";
import Request, { IRequest } from "@/app/api/models/request.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../../middleware/authenticator";
import { CreateRequestDTO, UpdateRequestStatusDTO } from "../../../dto/requests.dto";
import { RequestStatus } from "../../../types/requests";
import { generateRequestToken } from "@/helpers/common";
import moment from "moment";
import User, { IUser } from "../../../models/user.model";

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

        const payload: { id: string } = await (req as any).json();

        // Ensure the request exists
        const request: IRequest | null = await Request.findById(payload.id);
        if (!request) {
            return NextResponse.json(
                { message: "Invalid request ID" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }


        const customer = await User.findById(request.user).select({
            firstName: 1,
            lastName: 1,
            address: 1,
            email: 1,
            nationalIdNumber: 1,
            phoneNumber: 1,
            _id: 0
        });

        return NextResponse.json(
            {
                customer
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
