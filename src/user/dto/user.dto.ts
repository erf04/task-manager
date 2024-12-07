import { Expose, Type } from "class-transformer";
import { User } from "../user.entity";
import { Role } from "src/auth/roles/role.enum";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Project } from "src/projects/project.entity";
import { ProjectDto } from "src/projects/dto/project.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AssignDto } from "src/assign/dto/assign.dto";
import { EventNotif } from "src/notification/notification.entity";
import { EventNotifDto } from "src/notification/dto/event-notif.dto";

export class UserDto{
    @Expose()
    @ApiProperty({example:1})
    userId:number;
    @Expose()
    @ApiProperty()
    username:string;
    @Expose()
    @ApiProperty()
    firstName?:string;
    @Expose()
    @ApiProperty()
    lastName?:string;
    @Expose()
    @ApiProperty()
    roles:Role[]
    @Expose()
    @Type(()=>ProjectDto)
    @ApiProperty({type:()=> ProjectDto})
    projectsAsManager:ProjectDto[];

    @Expose()
    @Type(()=>ProjectDto)
    @ApiProperty({type:()=> [ProjectDto]})
    projectsAsParticipant:ProjectDto[]

    @Expose()
    @Type(()=>AssignDto)
    @ApiProperty({type:()=> AssignDto})
    assignedTasks:AssignDto[]

    @Expose()
    @Type(()=>EventNotif)
    @ApiProperty({type:()=> EventNotifDto})
    eventNotifs:EventNotifDto[]

}

export class UserCreationDto{ 
    @ApiProperty({required:true})
    username :string
    @ApiProperty({required:false}) 
    firstName?:string 
    @ApiProperty({required:false})
    lastName?:string 
    @ApiProperty({required:true})
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