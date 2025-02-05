
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Delivery from "@/app/api/models/deliveries.model";
import Outlet, { IOutlet } from "@/app/api/models/outlet.model";
import Request, { IRequest } from "@/app/api/models/request.model";
import { BusinessVerifcationStatus, GasTypesValues, HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../middleware/authenticator";
import { CreateRequestDTO } from "../../dto/requests.dto";
import { RequestStatus } from "../../types/requests";
import { generateRequestToken } from "@/helpers/common";
import moment from "moment";
import User, { IUser } from "../../models/user.model";
import { UserRole } from "../../types/user";
import { FilterQuery } from "mongoose";
import EmailService from "../../lib/EmailService.lib";
import { DeliveryStatus } from "../../types/deliveries";
import Product, { IProduct } from "../../models/product.model";

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

        let query: FilterQuery<IRequest> = {
            status: {
                $nin: [RequestStatus.CANCELLED]
            }
        }

        if ([UserRole.CUSTOMER, UserRole.BUSINESS].includes(user.userRole)) {
            query.user = userId
        } else if ([UserRole.OUTLET_MANAGER].includes(user.userRole)) {
            query.outlet = user.outlet
        } else if (user.userRole === UserRole.ADMIN) {
            query = {}
        }


        const requests = await Request.find(query)
            .sort({ createdAt: -1 })
            .populate('outlet', {
                name: 1, district: 1, city: 1
            })
            .populate('user', { firstName: 1, lastName: 1, email: 1 });

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

        const user: IUser | null = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            );
        }

        const payload: CreateRequestDTO = (req as any).payload;

        const customerId = user.userRole === UserRole.OUTLET_MANAGER ?
            payload.customerId ? payload.customerId : undefined : userId;
        const outletId = payload.outlet ?? user.outlet;

        const customer: IUser | null = await User.findById(customerId)


        if (!customer) {
            return NextResponse.json(
                { message: "Invalid customer" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }
        // Check if customer is a Business and verification status
        if (customer.userRole === UserRole.BUSINESS
            && customer.businessVerificationStatus !== BusinessVerifcationStatus.VERIFIED) {
            return NextResponse.json(
                { message: "Business user not verified yet" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Ensure the outlet exists
        const outletExists: IOutlet | null = await Outlet.findById(outletId);
        if (!outletExists) {
            return NextResponse.json(
                { message: "Invalid outlet ID" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        if (!outletExists.isActive) {
            return NextResponse.json(
                { message: "Outlet is under maintainance, please check later" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        const product: IProduct | null = await Product.findById(payload.productId);

        if (!product) {
            return NextResponse.json(
                {
                    message: "Product not found",
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Current Stock
        let availableStock = (outletExists.currentStock as any)[payload.productId as any] || 0;

        // Pending Deliveries for the outlet
        const upcomingDeliveries = (await Delivery.find({
            outlet: outletId,
            status: {
                $nin: [DeliveryStatus.CANCELLED, DeliveryStatus.ARRIVED]
            }
        }) || []).reduce((c, delivery: any) => c += delivery?.items?.find((i: any) => String(i.productId) === payload.productId)?.quantity || 0, 0)

        if (upcomingDeliveries) {
            availableStock += upcomingDeliveries
        }

        // Current Requests
        const currentRequests = (await Request.find({
            outlet: outletId,
            productId: payload.productId,
            status: RequestStatus.PLACED
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

        const token = generateRequestToken(outletExists);
        const deadlineForPickup = moment().add(2, 'weeks').toISOString()
        const total = Number(product.price) * Number(payload.quantity);
        // Create the request
        const newRequest = await Request.create({
            outlet: outletId,
            user: customerId,
            customerName: !customerId ? payload.customerName : undefined,
            customerEmail: !customerId ? payload.customerEmail : undefined,
            customerPhoneNumber: !customerId ? payload.customerPhoneNumber : undefined,
            customerAddress: !customerId ? payload.customerAddress : undefined,
            token,
            productId: payload.productId,
            quantity: payload.quantity,
            deadlineForPickup,
            timelines: [
                {
                    date: moment().toISOString(),
                    status: RequestStatus.PLACED
                }
            ],
            total: total,
            status: RequestStatus.PLACED
        });

        const customerEmail = customer ? customer.email : payload.customerEmail;
        const customerName = customer ? customer.firstName : payload.customerName;

        if (customerEmail) {
            process.nextTick(() => {
                (async () => {
                    const product = await Product.findById(payload.productId)
                    // Send Email To Customer
                    await EmailService.notifyNewRequest(
                        customerName || 'Customer',
                        customerEmail,
                        token,
                        deadlineForPickup,
                        product.name,
                        payload.quantity,
                        total
                    )

                    // Send Email To Outlet
                    await EmailService.notifyOutletNewRequest(
                        outletExists.managerName,
                        customerName || 'Outlet Manager',
                        outletExists.managerEmail,
                        token,
                        deadlineForPickup,
                        product.name,
                        payload.quantity,
                        total
                    )
                })()
            })
        }


        return NextResponse.json(
            {
                message: "Request has been made successfully",
                request: newRequest
            },
            { status: HTTP_STATUS.CREATED }
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
