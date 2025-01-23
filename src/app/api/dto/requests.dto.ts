import { IsNotEmpty, IsNumber, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { DeliveryStatus } from "../types/deliveries";
import { RequestStatus } from "../types/requests";


export class CreateRequestDTO {
    @IsOptional()
    @IsMongoId({ message: "Outlet ID must be a valid MongoDB ObjectId" })
    outlet?: string;

    @IsOptional()
    @IsMongoId({ message: "Outlet ID must be a valid MongoDB ObjectId" })
    customerId?: string;

    @IsNotEmpty({ message: "Quantity is required" })
    @IsNumber({}, { message: "Quantity must be a number" })
    quantity!: number;

    @IsOptional()
    @IsEnum(RequestStatus, { message: `Status must be one of: ${Object.values(RequestStatus).join(", ")}` })
    status?: RequestStatus;
}


export class UpdateRequestStatusDTO {
    @IsNotEmpty({ message: "Delivery ID is required" })
    @IsMongoId({ message: "Delivery ID must be a valid MongoDB ObjectId" })
    _id!: string;

    @IsOptional()
    @IsMongoId({ message: "Delivery ID must be a valid MongoDB ObjectId" })
    outlet?: string;

    @IsOptional({ message: "Status is required" })
    @IsEnum(RequestStatus, { message: `Status must be one of: ${Object.values(RequestStatus).join(", ")}` })
    status?: RequestStatus;
}


export class RescheduleRequestStatusDTO {
    @IsNotEmpty({ message: "Delivery ID is required" })
    @IsMongoId({ message: "Delivery ID must be a valid MongoDB ObjectId" })
    _id!: string;

    @IsString()
    deadlineForPickup!: string;

    @IsString()
    @IsOptional()
    message?: string;
}