import { IsNotEmpty, IsNumber, IsEnum, IsMongoId, IsOptional } from "class-validator";
import { DeliveryStatus } from "../types/deliveries";
import { RequestStatus } from "../types/requests";


export class CreateRequestDTO {
    @IsNotEmpty({ message: "Outlet ID is required" })
    @IsMongoId({ message: "Outlet ID must be a valid MongoDB ObjectId" })
    outlet!: string;

    @IsNotEmpty({ message: "Quantity is required" })
    @IsNumber({}, { message: "Quantity must be a number" })
    quantity!: number;

    @IsNotEmpty({ message: "Date of delivery is required" })
    dateRequested!: string;

    @IsOptional()
    @IsEnum(RequestStatus, { message: `Status must be one of: ${Object.values(RequestStatus).join(", ")}` })
    status?: RequestStatus;
}


export class UpdateRequestStatusDTO {
    @IsNotEmpty({ message: "Delivery ID is required" })
    @IsMongoId({ message: "Delivery ID must be a valid MongoDB ObjectId" })
    _id!: string;

    @IsOptional({ message: "Status is required" })
    @IsEnum(RequestStatus, { message: `Status must be one of: ${Object.values(RequestStatus).join(", ")}` })
    status?: RequestStatus;
}
