
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Request, { IRequest } from "@/app/api/models/request.model";
import { GasTypes, HTTP_STATUS } from "@/constants/common";
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
        const delivery: any = await Delivery.findById(payload._id);
        if (!delivery) {
            return NextResponse.json(
                { message: "Invalid delivery ID" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }


        delivery.status = payload.status as DeliveryStatus;
        delivery.timelines.push({
            date: moment().toISOString(),
            status: payload.status as DeliveryStatus
        })
        await delivery.save();

        if (payload.status === DeliveryStatus.ARRIVED) {
            // Update Outlet Stock
            const outlet = await Outlet.findById(user.outlet)
            outlet.currentStock = {
                [GasTypes.TWO_KG]: (outlet.currentStock?.[GasTypes.TWO_KG] || 0) + (delivery.items?.find((i: any) => i.type === GasTypes.TWO_KG)?.quantity || 0),
                [GasTypes.FIVE_KG]: (outlet.currentStock?.[GasTypes.FIVE_KG] || 0) + (delivery.items?.find((i: any) => i.type === GasTypes.FIVE_KG)?.quantity || 0),
                [GasTypes.TWELVE_HALF_KG]: (outlet.currentStock?.[GasTypes.TWELVE_HALF_KG] || 0) + (delivery.items?.find((i: any) => i.type === GasTypes.TWELVE_HALF_KG)?.quantity || 0),
                [GasTypes.SIXTEEN_KG]: (outlet.currentStock?.[GasTypes.SIXTEEN_KG] || 0) + (delivery.items?.find((i: any) => i.type === GasTypes.SIXTEEN_KG)?.quantity || 0),
            }
            outlet.stockHistory = [...(outlet.stockHistory || []), ...(delivery.items.map((item: any) => (
                {
                    dateAdded: moment().toISOString(),
                    type: item.type,
                    quantity: item.quantity
                }
            )))]

            await outlet.save();
        }

        process.nextTick(() => {
            (async () => {
                // Update Customer Request Status
                await Request.updateMany(
                    {
                        outlet: delivery.outlet,
                        status: {
                            $nin: [RequestStatus.CANCELLED, RequestStatus.DELIVERED, RequestStatus.EXPIRED]
                        }
                    },
                    {
                        $set: {
                            status: payload.status
                        },
                        $push: {
                            timelines: {
                                date: moment().toISOString(),
                                status: payload.status
                            }
                        }
                    }
                )


                // If Delivery is Arrived at Outlet
                if (payload.status === DeliveryStatus.ARRIVED) {
                    const requests = await Request.find({
                        outlet: user.outet,
                        status: {
                            $in: [
                                RequestStatus.PLACED,
                                RequestStatus.READY,
                                RequestStatus.CONFIRMED,
                                RequestStatus.DISPATCHED,
                                RequestStatus.ARRIVED
                            ]
                        }
                    }).populate('user', { firstName: 1, lastName: 1, email: 1 }).select({ user: 1 })
                    if (requests?.length) {
                        const users = requests.map(r => ({
                            name: r.user.firstName + ' ' + r.user.lastName,
                            email: r.user.email,
                            dateToBeCollected: moment().add(1, 'days').format('YYYY-MM-DD')
                        }))

                        await Promise.all(users.map(async (user: any) => {
                            await EmailService.notifyCustomerHandoverEmptyCylinderAndCollect(
                                user.name,
                                user.email,
                                user.dateToBeCollected
                            )
                        }))
                    }
                }
            })();
        })

        return NextResponse.json(
            {
                message: "Delivery has been updated successfully"
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
