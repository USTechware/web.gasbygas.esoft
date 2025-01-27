
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
    @ValidateBody(UpdateRequestStatusDTO)
    async PUT(req: Request) {
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

        const payload: UpdateRequestStatusDTO = (req as any).payload;

        // Ensure the request exists
        const request: IRequest | null = await Request.findById(payload._id);
        if (!request) {
            return NextResponse.json(
                { message: "Invalid request ID" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        const outlet = await Outlet.findById(request.outlet);

        if (!outlet) {
            return NextResponse.json(
                { message: "Outlet not found" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Mark status as completed
        request.status = RequestStatus.DELIVERED;
        request.timelines.push({
            date: moment().toISOString(),
            status: RequestStatus.DELIVERED
        })
        await request.save();

        // Reduce from Outlet Stocks
        outlet.currentStock = {
            ...outlet.currentStock,
            [request.type]: Number(outlet.currentStock[request.type] || 0) - Number(request.quantity || 0)
        }
        
        await outlet.save();

        return NextResponse.json(
            {
                message: "Request has been issued successfully"
            },
            { status: HTTP_STATUS.OK }
        );
    }
}

export const PUT = async (req: Request, res: Response) => {
    const controller = new RequestsController();
    try {
        return await controller.PUT(req);
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
