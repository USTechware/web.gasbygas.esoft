import { IsNotEmpty, IsNumber, IsEnum, IsMongoId, IsOptional, IsString, IsBoolean } from "class-validator";
import { DeliveryStatus } from "../types/deliveries";
import { RequestStatus } from "../types/requests";
import { GasTypes } from "@/constants/common";


export class CreateRequestDTO {
    @IsOptional()
    @IsMongoId({ message: "Outlet ID must be a valid MongoDB ObjectId" })
    outlet?: string;

    @IsOptional()
    @IsBoolean()
    isExistingCustomer?: boolean;

    @IsOptional()
    @IsMongoId({ message: "Outlet ID must be a valid MongoDB ObjectId" })
    customerId?: string;

    @IsOptional()
    @IsString()
    customerName?: string;

    @IsOptional()
    @IsString()
    customerEmail?: string;

    @IsOptional()
    @IsString()
    customerPhoneNumber?: string;

    @IsOptional()
    @IsString()
    customerAddress?: string;
    
    @IsEnum(GasTypes, { message: `Gas Type must be one of: ${Object.keys(GasTypes).join(", ")}` })
    type?: GasTypes;

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