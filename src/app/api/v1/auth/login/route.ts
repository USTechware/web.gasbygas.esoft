import { LoginUserDTO } from "@/app/api/dto/user.dto";
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import User from "@/app/api/models/user.model";
import "@/app/api/models/outlet.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import AuthProvider from "@/app/api/utils/auth";

class LoginController {
    @ValidateBody(LoginUserDTO)
    async POST(req: Request) {
        const payload = (req as any).payload;

        await DatabaseService.connect();

        // Find the user by email
        const user = await User.findOne({ email: payload.email })
            .populate('outlet', { name: 1, _id: 0});
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Verify the password
        const isPasswordValid = await AuthProvider.matchPassword(payload.password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Generate JWT token
        const token = AuthProvider.generateToken({ userId: user._id, email: user.email });

        // Return the response with user data and token
        return NextResponse.json(
            {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    address: user.address,
                    city: user.city,
                    district: user.district,
                    userRole: user.userRole,
                    email: user.email,
                    outlet: user.outlet,
                    nationalIdNumber: user.nationalIdNumber,
                    phoneNumber: user.phoneNumber,
                    requestChangePassword: user.requestChangePassword
                },
                token,
            },
            { status: HTTP_STATUS.OK }
        );
    }
}

export const POST = async (req: Request, res: Response) => {
    const controller = new LoginController();
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
