
import DatabaseService from "@/app/api/utils/db";
import { HTTP_STATUS } from "@/constants/common";
import { NextResponse } from "next/server";
import { AuthGuard } from "../../middleware/authenticator";
import Product from "../../models/product.model";

class ProductController {
    @AuthGuard()
    async GET(req: Request) {
        try {
            await DatabaseService.connect();

            const products = await Product.find({}) || [];

            return NextResponse.json(
                { products },
                { status: HTTP_STATUS.OK }
            );
        } catch (error) {
            return NextResponse.json(
                {},
                { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
            );
        }
    }
}

export const GET = async (req: Request, res: Response) => {
    const controller = new ProductController();
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
