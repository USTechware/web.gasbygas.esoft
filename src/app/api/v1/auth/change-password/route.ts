import { ChangePassowordDTO } from "@/app/api/dto/user.dto";
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import User from "@/app/api/models/user.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import AuthProvider from "@/app/api/utils/auth";
import { AuthGuard } from "@/app/api/middleware/authenticator";

class ChangePasswordController {
    @AuthGuard()
    @ValidateBody(ChangePassowordDTO)
    async POST(req: Request) {
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
        const payload: ChangePassowordDTO = (req as any).payload;


        // Verify the password
        const isPasswordValid = await AuthProvider.matchPassword(payload.currentPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid current password" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Encript New Password
        const encryptPassword = await AuthProvider.encryptPassword(payload.newPassword);

        // Update New Password
        user.password = encryptPassword
        user.requestChangePassword = false
        await user.save();

        // Return the response with user data and token
        return NextResponse.json(
            {
                message: "User password has been updated successfully"
            },
            { status: HTTP_STATUS.OK }
        );
    }
}

export const POST = async (req: Request, res: Response) => {
    const controller = new ChangePasswordController();
    try {
        return await controller.POST(req);
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
