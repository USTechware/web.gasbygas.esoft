
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Delivery, { IDelivery } from "@/app/api/models/deliveries.model";
import Outlet, { IOutlet } from "@/app/api/models/outlet.model";
import Request, { IRequest } from "@/app/api/models/request.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../middleware/authenticator";
import { CreateRequestDTO } from "../../dto/requests.dto";
import { RequestStatus } from "../../types/requests";
import { generateRequestToken } from "@/helpers/common";
import moment from "moment";
import User, { IUser } from "../../models/user.model";
import { UserRole } from "../../types/user";
import { FilterQuery } from "mongoose";

class RequestsController {

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

        if ([UserRole.CUSTOMER, UserRole.BUSINESS].includes(user.userRole)) {
            query.user = userId
        } else if ([UserRole.OUTLET_MANAGER].includes(user.userRole)) {
            query.outlet = user.outlet
        } else if (user.userRole === UserRole.DISTRIBUTOR) {
            query = {}
        }


        const requests = await Request.find(query).populate('outlet');

        return NextResponse.json(
            requests,
            { status: HTTP_STATUS.OK }
        );
    }
    @AuthGuard()
    @ValidateBody(CreateRequestDTO)
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

        const payload: CreateRequestDTO = (req as any).payload;

        // Ensure the outlet exists
        const outletExists: IOutlet | null = await Outlet.findById(payload.outlet);
        if (!outletExists) {
            return NextResponse.json(
                { message: "Invalid outlet ID" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Current Stock
        let availableStock = outletExists.currentStock;

        // Expected Deliveries within next 2 weeks
        const upcomingDeliveries = (await Delivery.find({
            outlet: outletExists._id,
            dateOfDelivery: {
                $lte: moment().add(2, 'weeks')
            }
        }) || []).reduce((c, delievery: IDelivery) => c += delievery.quantity, 0)

        if (upcomingDeliveries) {
            availableStock += upcomingDeliveries
        }

        // Current Requests
        const currentRequests = (await Request.find({
            outlet: outletExists._id,
            dateRequested: {
                $lte: moment().add(2, 'weeks')
            },
            status: RequestStatus.PENDING
        }) || []).reduce((c, request: IRequest) => c += request.quantity, 0)

        if (currentRequests > 0) {
            availableStock -= currentRequests;
        }

        if (availableStock < payload.quantity) {
            return NextResponse.json(
                {
                    message: "There's no stock available, please try again later",
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Create the request
        const newRequest = await Request.create({
            outlet: payload.outlet,
            user,
            token: generateRequestToken(outletExists),
            quantity: payload.quantity,
            dateRequested: payload.dateRequested,
            status: RequestStatus.PENDING
        });

        return NextResponse.json(
            {
                message: "Request has been made successfully",
                request: newRequest
            },
            { status: HTTP_STATUS.CREATED }
        );
    }
}

export const PUT = async (req: Request, res: Response) => {
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


export const GET = async (req: Request, res: Response) => {
    const controller = new RequestsController();
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
