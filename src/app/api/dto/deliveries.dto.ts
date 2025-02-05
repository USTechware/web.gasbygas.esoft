import { IsNotEmpty, IsNumber, IsEnum, IsMongoId, IsOptional, ArrayMinSize, ValidateNested } from "class-validator";
import { DeliveryStatus } from "../types/deliveries";

export class DeliveryItemDTO {
    @IsNotEmpty({ message: "Product Id is required" })
    productId!: string;

    @IsNotEmpty({ message: "Item quantity is required" })
    @IsNumber({}, { message: "Item quantity must be a number" })
    quantity!: number;
}

export class CreateDeliveryDTO {
    @IsNotEmpty({ message: "Items are required" })
    @ArrayMinSize(1, { message: "At least one item is required" })
    @ValidateNested({ each: true })
    items!: DeliveryItemDTO[];

    @IsOptional()
    @IsEnum(DeliveryStatus, { message: `Status must be one of: ${Object.values(DeliveryStatus).join(", ")}` })
    status?: DeliveryStatus;
}


export class UpdateDeliveryStatusDTO {
    @IsNotEmpty({ message: "Delivery ID is required" })
    @IsMongoId({ message: "Delivery ID must be a valid MongoDB ObjectId" })
    _id!: string;

    @IsEnum(DeliveryStatus, { message: `Status must be one of: ${Object.values(DeliveryStatus).join(", ")}` })
    status?: DeliveryStatus;
}
