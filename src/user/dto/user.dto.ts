import { Expose, Type } from "class-transformer";
import { User } from "../user.entity";
import { Role } from "src/auth/roles/role.enum";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserDto{
    @Expose()
    userId:number;
    @Expose()
    username:string;
    @Expose()
    firstName?:string;
    @Expose()
    lastName?:string;
    @Expose()
    roles:Role[]
}

export class UserCreationDto{ 
    username :string 
    firstName?:string 
    lastName?:string 
    password:string
    
}

export class UserUpdateDto{
    @Expose()
    @IsString()
    @IsNotEmpty()
    username:string;

    @Expose()
    @IsString()
    @IsOptional()
    firstName?:string;

    @Expose()
    @IsString()
    @IsOptional()
    lastName?:string;

    @Expose()
    @IsNumber()
    @IsNotEmpty()
    userId:number

    @Expose()
    @IsString()
    @IsOptional()
    @IsEnum(Role)
    roles:Role[]
}