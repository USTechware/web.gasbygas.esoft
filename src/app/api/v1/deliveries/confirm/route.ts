
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Request, { IRequest } from "@/app/api/models/request.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../../middleware/authenticator";
import User from "../../../models/user.model";
import Delivery from "../../../models/deliveries.model";
import { UpdateDeliveryStatusDTO } from "@/app/api/dto/deliveries.dto";
import { IDelivery } from "@/app/api/models/deliveries.model";
import { DeliveryStatus } from "@/app/api/types/deliveries";
import Outlet from "@/app/api/models/outlet.model";
import moment from "moment";
import { RequestStatus } from "@/app/api/types/requests";
import EmailService from "@/app/api/lib/EmailService.lib";

class DeliveriesController {

    @AuthGuard()
    @ValidateBody(UpdateDeliveryStatusDTO)
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

        const payload: UpdateDeliveryStatusDTO = (req as any).payload;

        // Ensure the delivery exists
        const delivery: IDelivery | null = await Delivery.findById(payload._id);
        if (!delivery) {
            return NextResponse.json(
                { message: "Invalid delivery ID" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }


        delivery.status = DeliveryStatus.DELIVERED;
        await delivery.save();

        // Update Outlet Stock
        const outlet = await Outlet.findById(user.outlet)
        outlet.currentStock = (outlet.currentStock || 0) + delivery.quantity;
        outlet.stockHistory = [...(outlet.stockHistory || []), {
            dateAdded: moment().toISOString(),
            quantity: delivery.quantity
        }]

        await outlet.save();

        process.nextTick(() => {
            (async () => {
                // Send Notification To All Pending Customers
                const requests = await Request.find({
                    outlet: outlet.id,
                    status: RequestStatus.PENDING
                }).populate('user')

                if (requests?.length) {
                    const users = requests.map(r => ({
                        name: r.user.firstName + ' ' + r.user.lastName,
                        email: r.user.email,
                        dateToBeCollected: moment().format('YYYY-MM-DD')
                    }))

                    await Promise.all(users.map(async (user) => {
                        await EmailService.notifyCustomerHandoverEmptyCylinderAndCollect(
                            user.name,
                            user.email,
                            user.dateToBeCollected
                        )
                    }))
                }
            })();
        })

        return NextResponse.json(
            {
                message: "Delivery has been delivered successfully"
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
