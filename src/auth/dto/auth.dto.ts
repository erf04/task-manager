import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class LoginDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({required:true})
    username:string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({required:true})
    password:string
}

export class LoginResponseDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({required:true})
    accessToken:string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({required:true})
    refreshToken:string;
}