import DatabaseService from "@/app/api/utils/db";
import User from "@/app/api/models/user.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "@/app/api/middleware/authenticator";
import { UpdateUserDTO } from "@/app/api/dto/user.dto";
import { ValidateBody } from "@/app/api/middleware/validator";

class Controller {
    @AuthGuard()
    @ValidateBody(UpdateUserDTO)
    async put(req: Request) {
        const userId = (req as any).userId;

        await DatabaseService.connect();

        // Find the user by email
        const user = await User.findOne({ _id: userId })
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Update User Fields
        const payload: UpdateUserDTO = (req as any).payload;
        user.firstName = payload.firstName;
        user.lastName = payload.lastName;
        user.address = payload.address;
        user.city = payload.city;
        user.district = payload.district;

        await user.save();

        // Return the response with user
        return NextResponse.json(
            {
                message: "User has been updated successfully"
            },
            { status: HTTP_STATUS.OK }
        );
    }
}

export const PUT = async (req: Request, res: Response) => {
    const controller = new Controller();
    try {
        return await controller.put(req);
    } catch (error: any) {
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
