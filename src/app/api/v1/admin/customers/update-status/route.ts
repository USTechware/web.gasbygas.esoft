
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Request from "@/app/api/models/request.model";
import { BusinessVerifcationStatus, HTTP_STATUS } from "@/constants/common";
import { NextRequest, NextResponse } from "next/server";
import { AuthGuard } from "../../../../middleware/authenticator";
import User from "../../../../models/user.model";
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

export const PUT = async (req: NextRequest) => {
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
