import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Assign } from "src/assign/assign.entity";
import { AssignDto } from "src/assign/dto/assign.dto";
import { EventType } from "src/event/constants";
import { UserDto } from "src/user/dto/user.dto";
import { EventNotif } from "../notification.entity";
import { ApiProperty } from "@nestjs/swagger";


export class CreateEventNotifDto {
    @IsNotEmpty()
    receiverId: number;
    @IsEnum(EventType)
    @IsNotEmpty()
    type: EventType;


    @IsNotEmpty()
    assignId:number;

}

export class EventNotifDto{
    @ApiProperty()
    id:number
    @ApiProperty({enum:EventType})
    type:EventType

    @ApiProperty({type:()=>UserDto})
    receiver:UserDto

    @ApiProperty({default:new Date()})
    date:Date = new Date()

    @ApiProperty({type:()=>AssignDto})
    assign:AssignDto
}