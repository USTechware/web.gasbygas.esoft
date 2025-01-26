
import { ValidateBody } from "@/app/api/middleware/validator";
import DatabaseService from "@/app/api/utils/db";
import Inventory from "@/app/api/models/inventory.model";
import { GasTypes, HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { CreateInventoryDTO } from "../../dto/inventory.dto";
import { AuthGuard } from "../../middleware/authenticator";

class OutletController {
    @AuthGuard()
    async GET(req: Request) {
        try {
            await DatabaseService.connect();

            const inventory = await Inventory.findOne();

            if (!inventory) {
                return NextResponse.json(
                    {},
                    { status: HTTP_STATUS.OK }
                );
            }

            return NextResponse.json(
                inventory,
                { status: HTTP_STATUS.OK }
            );
        } catch (error) {
            return NextResponse.json(
                {},
                { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
            );
        }
    }
    @AuthGuard()
    @ValidateBody(CreateInventoryDTO)
    async POST(req: Request) {
        await DatabaseService.connect();
        const payload: CreateInventoryDTO = (req as any).payload;

        const inventory = await Inventory.findOne();

        if (!inventory) {
            const newInventory = new Inventory({
                currentStock: {
                    [GasTypes.TWO_KG]: 0,
                    [GasTypes.FIVE_KG]: 0,
                    [GasTypes.TWELVE_HALF_KG]: 0,
                    [GasTypes.SIXTEEN_KG]: 0,
                },
                history: [{ dateAdded: payload.dateAdded || new Date(), quantity: payload.quantity }]
            });
            await newInventory.save();
            return newInventory;
        }

        // Update the existing inventory
        inventory.currentStock = {
            ...(inventory.currentStock || {}),
            [payload.type as string]: (inventory.currentStock[payload.type as string] || 0) + payload.quantity
        };
        inventory.history.push({ type: payload.type, dateAdded: payload.dateAdded || new Date(), quantity: payload.quantity });
        await inventory.save();


        return NextResponse.json(
            {
                message: "Inventory has been updated successfully"
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
