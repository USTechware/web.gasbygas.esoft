import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterUserDTO {
    @IsNotEmpty({ message: "First Name is required" })
    @IsString()
    firstName!: string;

    @IsNotEmpty({ message: "Last Name is required" })
    @IsString()
    lastName!: string;

    @IsEmail({}, { message: "Invalid email format" })
    email!: string;

    @IsNotEmpty({ message: "User Role is required" })
    @IsString()
    userRole!: string;

    @MinLength(6, { message: "Password must be at least 6 characters long" })
    password!: string;

    @IsOptional()
    nationalIdNumber!: string;

    @IsOptional()
    businessRegId!: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;
}

export class LoginUserDTO {
    @IsEmail({}, { message: "Invalid email format" })
    email!: string;

    @IsNotEmpty({ message: "Password is required" })
    password!: string;
}
