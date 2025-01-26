
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Request, { IRequest } from "@/app/api/models/request.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../../middleware/authenticator";
import { UpdateRequestStatusDTO } from "../../../dto/requests.dto";
import { RequestStatus } from "../../../types/requests";
import User from "../../../models/user.model";
import moment from "moment";

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


        request.status = RequestStatus.CANCELLED;
        request.timelines.push({
            date: moment().toISOString(),
            status: RequestStatus.CANCELLED
        })
        await request.save();

        return NextResponse.json(
            {
                message: "Request has been expired successfully"
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
