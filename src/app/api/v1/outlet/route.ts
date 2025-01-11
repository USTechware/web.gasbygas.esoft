import { CreateOutletDTO } from "@/app/api/dto/outlet.dto";
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Outlet from "@/app/api/models/outlet.model";
import User from "@/app/api/models/user.model";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import AuthProvider from "@/app/api/utils/auth";
import { AuthGuard } from "../../middleware/authenticator";
import EmailService from "../../lib/EmailService.lib";

class OutletController {
    @AuthGuard()
    async GET(req: Request) {

        await DatabaseService.connect();

        const outlets = await Outlet.find({}).sort({
            createdAt: -1
        });

        return NextResponse.json(
            outlets,
            { status: HTTP_STATUS.OK }
        );

    }
    @AuthGuard()
    @ValidateBody(CreateOutletDTO)
    async POST(req: Request) {
        await DatabaseService.connect();
        const payload: CreateOutletDTO = (req as any).payload;

        // Check if an outlet with the same name exists in the district
        const existingOutlet = await Outlet.findOne({
            name: payload.name,
            district: payload.district
        });


        if (existingOutlet) {
            return NextResponse.json(
                { message: "Outlet already exists in this district" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }
        // Check if the manager's email is already associated with a user
        const existingUser = await User.findOne({ email: payload.managerEmail });

        if (existingUser) {
            return NextResponse.json(
                { message: "Manager email already exists" },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }


        // Create the outlet
        const outlet = await Outlet.create({
            name: payload.name,
            district: payload.district,
            city: payload.city,
            address: payload.address,
            managerName: payload.managerName,
            managerEmail: payload.managerEmail,
            managerPhoneNumber: payload.managerPhoneNumber,
            currentStock: 0,
            stockHistory: []
        });

        if (!outlet) {
            return NextResponse.json(
                {
                    message: "Failed to create the outlet",
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Generate a temporary password for the manager
        const tempPassword = AuthProvider.generateTempPassword();

        // Create a new user for the outlet manager
        await User.create({
            firstName: payload.managerName.split(" ")[0],
            lastName: payload.managerName.split(" ").slice(1).join(" ") || "Manager",
            email: payload.managerEmail,
            userRole: "OUTLET_MANAGER",
            password: await AuthProvider.encryptPassword(tempPassword),
            phoneNumber: payload.managerPhoneNumber,
            address: payload.address,
            outlet: outlet._id
        });

        // Send the temporary password to the manager's email
        await EmailService.sendOutletCreationEmail(
            payload.managerName,
            payload.managerEmail,
            tempPassword
        )

        return NextResponse.json(
            {
                message: "Outlet and manager account have been created successfully",
                _id: outlet._id
            },
            { status: HTTP_STATUS.CREATED }
        );
    }
}

export const POST = async (req: Request, res: Response) => {
    const controller = new OutletController();
    try {
        return await controller.POST(req);
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


export const GET = async (req: Request, res: Response) => {
    const controller = new OutletController();
    try {
        return await controller.GET(req);
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
