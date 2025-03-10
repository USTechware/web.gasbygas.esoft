
import { RegisterUserDTO } from "@/app/api/dto/user.dto";
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import User from "@/app/api/models/user.model";
import { BusinessVerifcationStatus, HTTP_STATUS } from "@/constants/common";
import { NextRequest, NextResponse } from "next/server";
import AuthProvider from "@/app/api/utils/auth";
import { UserRole } from "@/app/api/types/user";

class RegisterController {
    @ValidateBody(RegisterUserDTO)
    async POST(req: NextRequest) {
        await DatabaseService.connect();
        const payload: RegisterUserDTO = (req as any).payload;

        let existingCustomer, existingBusiness;

        if (payload.userRole === UserRole.CUSTOMER) {
            existingCustomer = await User.findOne({
                $or: [
                    { email: payload.email },
                    { nationalIdNumber: payload.nationalIdNumber },
                ]
            });
            if (existingCustomer) {
                return NextResponse.json(
                    { message: "A customer already exists with same email or NIC number" },
                    { status: HTTP_STATUS.BAD_REQUEST }
                );
            }

        } else if (payload.userRole === UserRole.BUSINESS) {
            existingBusiness = await User.findOne({
                $or: [
                    { email: payload.email },
                    { businessRegId: payload.businessRegId },
                ]
            });
            if (existingBusiness) {
                return NextResponse.json(
                    { message: "A business user already exists with same email or Business ID" },
                    { status: HTTP_STATUS.BAD_REQUEST }
                );
            }

            if (!payload.businessVerificationDoc) {
                return NextResponse.json(
                    { message: "A document confirming the Business should be uploadedß" },
                    { status: HTTP_STATUS.BAD_REQUEST }
                );
            }
        } else {
            return NextResponse.json(
                { message: "Invalid user type for signup" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        await User.create({
            ...payload,
            password: await AuthProvider.encryptPassword(payload.password),
            businessVerificationStatus: payload.userRole === UserRole.BUSINESS
                ? BusinessVerifcationStatus.PENDING : undefined,
            businessVerificationDoc: payload.userRole === UserRole.BUSINESS
                ? payload.businessVerificationDoc : undefined,
            company: payload.userRole === UserRole.BUSINESS
                ? payload.company : undefined,
        });

        return NextResponse.json(
            {
                message: "User has been created successfully"
            },
            { status: HTTP_STATUS.CREATED }
        );

    }
}

export const POST = async (req: NextRequest) => {
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
