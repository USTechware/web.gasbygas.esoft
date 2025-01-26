import DatabaseService from "@/app/api/utils/db";
import User from "@/app/api/models/user.model";
import Inventory from "@/app/api/models/inventory.model";
import Outlet from "@/app/api/models/outlet.model";
import Request from "@/app/api/models/request.model";
import Delivery from "@/app/api/models/deliveries.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "@/app/api/middleware/authenticator";
import { UserRole } from "../../types/user";
import { RequestStatus } from "../../types/requests";

class Controller {
    @AuthGuard()
    async get(req: Request) {
        const userId = (req as any).userId;

        await DatabaseService.connect();

        // Find the user by ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        let data: any = {};

        switch (user.userRole) {
            case UserRole.ADMIN:
                const inventoryCount = (await Inventory.findOne().select({ currentStock: 1 }))?.currentStock || {};
                const outletsCount = await Outlet.countDocuments();
                const requestsCount = await Request.countDocuments();
                const deliveriesCount = await Delivery.countDocuments();

                data = {
                    inventory: Object.values(inventoryCount as Record<string, number>).reduce((c, i) => c += i, 0),
                    outlets: outletsCount,
                    requests: requestsCount,
                    deliveries: deliveriesCount,
                };
                break;

            case UserRole.OUTLET_MANAGER:
                const currentStock = (await Outlet.findById(user.outlet))?.currentStock || {};
                const stockCount = Object.values(currentStock as Record<string, number>).reduce((a: number, i: number) => a + i, 0)
                const outletRequestsCount = await Request.countDocuments({
                    outlet: user.outlet, status: {
                        $nin: [RequestStatus.CANCELLED]
                    }
                });
                const outletDeliveriesCount = await Delivery.countDocuments({ outlet: user.outlet });

                data = {
                    stocks: stockCount,
                    requests: outletRequestsCount,
                    deliveries: outletDeliveriesCount,
                };
                break;

            case UserRole.CUSTOMER:
            case UserRole.BUSINESS:
                const customerRequestsCount = await Request.countDocuments({ user: userId });

                data = {
                    requests: customerRequestsCount,
                };
                break;

            default:
                return NextResponse.json(
                    { message: "Invalid user access" },
                    { status: HTTP_STATUS.BAD_REQUEST }
                );
        }

        return NextResponse.json(
            data,
            { status: HTTP_STATUS.OK }
        );
    }
}

export const GET = async (req: Request, res: Response) => {
    const controller = new Controller();
    try {
        return await controller.get(req);
    } catch (error: any) {
        console.log(error, '')
        return NextResponse.json(
            {
                message: error.message || "Unknown error",
            },
            {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            }
        );
    }
};
