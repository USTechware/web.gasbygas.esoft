import { IsNotEmpty, IsNumber, IsEnum, IsMongoId, IsOptional } from "class-validator";
import { DeliveryStatus } from "../types/deliveries";

// DTO for creating a delivery
export class CreateDeliveryDTO {
    @IsNotEmpty({ message: "Outlet ID is required" })
    @IsMongoId({ message: "Outlet ID must be a valid MongoDB ObjectId" })
    outlet!: string;

    @IsNotEmpty({ message: "Quantity is required" })
    @IsNumber({}, { message: "Quantity must be a number" })
    quantity!: number;

    @IsNotEmpty({ message: "Date of delivery is required" })
    dateOfDelivery!: string;

    @IsOptional()
    @IsEnum(DeliveryStatus, { message: `Status must be one of: ${Object.values(DeliveryStatus).join(", ")}` })
    status?: DeliveryStatus;
}


export class UpdateDeliveryStatusDTO {
    @IsNotEmpty({ message: "Delivery ID is required" })
    @IsMongoId({ message: "Delivery ID must be a valid MongoDB ObjectId" })
    _id!: string;
}
