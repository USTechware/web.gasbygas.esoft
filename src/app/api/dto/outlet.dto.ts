import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateOutletDTO {
    @IsNotEmpty({ message: "Outlet Name is required" })
    @IsString()
    name!: string;

    @IsNotEmpty({ message: "District is required" })
    @IsString()
    district!: string;

    @IsNotEmpty({ message: "City is required" })
    @IsString()
    city!: string;

    @IsNotEmpty({ message: "Address is required" })
    @IsString()
    address!: string;

    @IsNotEmpty({ message: "Manager Name is required" })
    @IsString()
    managerName!: string;

    @IsNotEmpty({ message: "Manager Email is required" })
    @IsEmail({}, { message: "Invalid email format" })
    managerEmail!: string;

    @IsNotEmpty({ message: "Manager Phone Number is required" })
    @IsPhoneNumber('LK', { message: "Invalid phone number format" })
    managerPhoneNumber!: string;
}
