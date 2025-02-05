import DatabaseService from "@/app/api/utils/db";
import Outlet from "@/app/api/models/outlet.model";
import User from "@/app/api/models/user.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextRequest, NextResponse } from "next/server";
import { AuthGuard } from "../../../middleware/authenticator";
import Requests from "@/app/api/models/request.model";
import { RequestStatus } from "@/app/api/types/requests";

class OutletController {
    @AuthGuard()
    async POST(req: NextRequest) {
        await DatabaseService.connect();

        const userId = (req as any).userId;

        // Fetch user details and outlet
        const user = await User.findById(userId).select({
            outlet: 1
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                },
                { status: HTTP_STATUS.UNAUTHORIZED }
            );
        }

        const { id } = await req.json();

        // Fetch the outlet details
        const outlet = await Outlet.findOne({
            _id: id
        }).select({
            name: 1,
            district: 1,
            city: 1,
            address: 1,
            managerName: 1,
            managerEmail: 1,
            managerPhoneNumber: 1,
            currentStock: 1,
        });

        if (!outlet) {
            return NextResponse.json(
                {
                    message: "Outlet not found",
                },
                { status: HTTP_STATUS.NOT_FOUND }
            );
        }

        const requests = await Requests.find({
            outlet: id
        })

        const pendingRequests = requests.filter((request: any) => ![RequestStatus.DELIVERED, RequestStatus.CANCELLED, RequestStatus.EXPIRED].includes(request.status)).length;
        const completedRequests = requests.filter((request: any) => [RequestStatus.DELIVERED].includes(request.status)).length;
        const expiredRequests = requests.filter((request: any) => [RequestStatus.CANCELLED, RequestStatus.EXPIRED].includes(request.status)).length;

        const result = {
            outletDetails: outlet,
            requests: {
                pending: pendingRequests,
                completed: completedRequests,
                expired: expiredRequests,
            },
            stocks: {
                current: outlet.currentStock || 0
            },
        };

        return NextResponse.json({ outlet: result}, { status: HTTP_STATUS.OK });
    }
}

// API route handler for the POST request
export const POST = async (req: NextRequest) => {
    const controller = new OutletController();
    try {
        return await controller.POST(req);
    } catch (error: any) {
        console.error("ERROR:", error);
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
