import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInventoryDTO {
    @IsString()
    @IsOptional()
    dateAdded?: string;

    @IsNotEmpty({ message: "Product Id is required" })
    productId!: string;

    @IsNotEmpty({ message: "Quantity is required" })
    @IsNumber({}, { message: "Quantity must be a number" })
    quantity!: number;
}
