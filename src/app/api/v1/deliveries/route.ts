
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Delivery from "@/app/api/models/deliveries.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { CreateDeliveryDTO } from "../../dto/deliveries.dto";
import Outlet from "../../models/outlet.model";
import { DeliveryStatus } from "../../types/deliveries";
import { AuthGuard } from "../../middleware/authenticator";
import User, { IUser } from "../../models/user.model";
import { FilterQuery } from "mongoose";
import { IRequest } from "../../models/request.model";
import { UserRole } from "../../types/user";
import moment from "moment";

class DeliveriesController {
    @AuthGuard()
    async GET(req: Request) {

        const userId = (req as any).userId;
        const user: IUser | null = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            );
        }

        await DatabaseService.connect();

        let query: FilterQuery<IRequest> = {}

        if ([UserRole.OUTLET_MANAGER].includes(user.userRole)) {
            query.outlet = user.outlet
        } else if (user.userRole === UserRole.ADMIN) {
            query = {}
        }

        const deliveries = await Delivery.find(query).populate('outlet');

        return NextResponse.json(
            deliveries,
            { status: HTTP_STATUS.OK }
        );
    }
    @AuthGuard()
    @ValidateBody(CreateDeliveryDTO)
    async POST(req: Request) {
        await DatabaseService.connect();

        const userId = (req as any).userId;
        const user: IUser | null = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            );
        }

        const pendingDeliveryExists = await Delivery.findOne({
            outlet: user.outlet,
            status: {
                $nin: [DeliveryStatus.CANCELLED, DeliveryStatus.ARRIVED]
            }
        });
        if (pendingDeliveryExists) {
            return NextResponse.json(
                { message: "You have a pending delivery, please wait it to be completed" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }


        const payload: CreateDeliveryDTO = (req as any).payload;

        // Ensure the outlet exists
        const outletExists = await Outlet.findById(user.outlet);
        if (!outletExists) {
            return NextResponse.json(
                { message: "Invalid outlet ID" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Create the delivery
        const newDelivery = await Delivery.create({
            outlet: user.outlet,
            items: payload.items,
            timelines: [
                {
                    date: moment().toISOString(),
                    status: DeliveryStatus.PLACED
                }
            ],
            status: DeliveryStatus.PLACED
        });

        return NextResponse.json(
            {
                message: "Delivery Request has been created successfully",
                delivery: newDelivery
            },
            { status: HTTP_STATUS.CREATED }
        );
    }
}

export const POST = async (req: Request, res: Response) => {
    const controller = new DeliveriesController();
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


export const GET = async (req: Request, res: Response) => {
    const controller = new DeliveriesController();
    try {
        return await controller.GET(req);
    } catch (error: any) {
        console.log("ERRR", error)
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
