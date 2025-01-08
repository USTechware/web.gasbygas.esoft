
import { RegisterUserDTO } from "@/app/api/dto/user.dto";
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import User from "@/app/api/models/user.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import AuthProvider from "@/app/api/utils/auth";

class RegisterController {
    @ValidateBody(RegisterUserDTO)
    async POST(req: Request) {
        await DatabaseService.connect();
        const payload: RegisterUserDTO = (req as any).payload;

        const existingUser = await User.findOne({
            $or: [
                { email: payload.email },
                { nationalIdNumber: payload.nationalIdNumber },
            ]
        });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists with same email or NIC number" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        await User.create({
            ...payload,
            password: await AuthProvider.encryptPassword(payload.password)
        });

        return NextResponse.json(
            {
                message: "User has been created successfully"
            },
            { status: HTTP_STATUS.CREATED }
        );

    }
}

export const POST = async (req: Request, res: Response) => {
    const controller = new RegisterController();
    try {
        return await controller.POST(req);
    } catch (error: any) {
        return NextResponse.json({
            message: error.message || "Unknown error"
        },
            {
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR
            });
    }
};
