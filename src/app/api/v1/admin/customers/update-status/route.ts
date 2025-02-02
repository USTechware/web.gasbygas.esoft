
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Request, { IRequest } from "@/app/api/models/request.model";
import { BusinessVerifcationStatus, GasTypes, HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../../../middleware/authenticator";
import User from "../../../../models/user.model";
import Delivery from "../../../../models/deliveries.model";
import { DeliveryItemDTO, UpdateDeliveryStatusDTO } from "@/app/api/dto/deliveries.dto";
import { IDelivery } from "@/app/api/models/deliveries.model";
import { DeliveryStatus } from "@/app/api/types/deliveries";
import Outlet from "@/app/api/models/outlet.model";
import moment from "moment";
import { RequestStatus } from "@/app/api/types/requests";
import EmailService from "@/app/api/lib/EmailService.lib";
import { UpdateBusinessStatusDTO } from "@/app/api/dto/user.dto";

class DeliveriesController {

    @AuthGuard()
    @ValidateBody(UpdateBusinessStatusDTO)
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

        const payload: UpdateBusinessStatusDTO = (req as any).payload;

        // Ensure the business exists
        const business: any = await User.findById(payload._id);
        if (!business) {
            return NextResponse.json(
                { message: "Invalid business user ID" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        business.businessVerificationStatus = payload.status as BusinessVerifcationStatus;
       
        await business.save();

        process.nextTick(() => {
            (async () => {
                // Send Verification Status To Business
                await EmailService.notifyBusinessVerificationStatus(
                    business.firstName,
                    business.email,
                    payload.status === BusinessVerifcationStatus.DENIED ? 'rejected' : 'approved',
                    payload.status === BusinessVerifcationStatus.DENIED ?
                        'Please send a valid a document.' : 'Document verfication is successful.',
                )
                
            })();
        })

        return NextResponse.json(
            {
                message: "Business user has been updated successfully"
            },
            { status: HTTP_STATUS.OK }
        );
    }
}

export const PUT = async (req: Request, res: Response) => {
    const controller = new DeliveriesController();
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
