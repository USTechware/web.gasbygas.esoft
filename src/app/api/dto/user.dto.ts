import { BusinessVerifcationStatus } from "@/constants/common";
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

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
    nationalIdNumber?: string;


    @IsOptional()
    company?: string;

    @IsOptional()
    businessRegId?: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsOptional()
    @IsString()
    businessVerificationStatus?: BusinessVerifcationStatus;

    @IsOptional()
    @IsString()
    businessVerificationDoc?: string;

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

export class ChangePassowordDTO {

    @IsNotEmpty({ message: "Current Password is required" })
    currentPassword!: string;

    @IsNotEmpty({ message: "New Password is required" })
    newPassword!: string;
}


export class UpdateUserDTO {
    @IsNotEmpty({ message: "First Name is required" })
    @IsString()
    firstName!: string;

    @IsNotEmpty({ message: "Last Name is required" })
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    city!: string;

    @IsNotEmpty()
    @IsString()
    district!: string;

    @IsOptional()
    @IsString()
    businessVerificationDoc?: string;
}

export class UpdateBusinessStatusDTO {
    @IsNotEmpty({ message: "Business User ID is required" })
    @IsMongoId({ message: "Busniness User ID must be a valid MongoDB ObjectId" })
    _id!: string;

    @IsEnum(BusinessVerifcationStatus, { message: `Status must be one of: ${Object.values(BusinessVerifcationStatus).join(", ")}` })
    status?: BusinessVerifcationStatus;
}