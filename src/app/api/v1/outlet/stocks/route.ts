import DatabaseService from "@/app/api/utils/db";
import Outlet from "@/app/api/models/outlet.model";
import User from "@/app/api/models/user.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../../middleware/authenticator";

class OutletController {
    @AuthGuard()
    async GET(req: Request) {

        await DatabaseService.connect();

        const userId = (req as any).userId;

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

        const outlet = await Outlet.findOne({
            _id: user.outlet
        }).select({
            currentStock: 1,
            stockHistory: 1,
        });

        return NextResponse.json(
            outlet,
            { status: HTTP_STATUS.OK }
        );

    }
}

export const GET = async (req: Request, res: Response) => {
    const controller = new OutletController();
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
