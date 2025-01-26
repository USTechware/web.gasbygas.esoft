import { GasTypes } from "@/constants/common";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInventoryDTO {
    @IsString()
    @IsOptional()
    dateAdded?: string;

    @IsString()
    type?: GasTypes;

    @IsNotEmpty({ message: "Quantity is required" })
    @IsNumber({}, { message: "Quantity must be a number" })
    quantity!: number;
}
