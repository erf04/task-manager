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
    @Type(()=>UserDto)
    receiver: UserDto;
    @IsEnum(EventType)
    @IsNotEmpty()
    type: EventType;

    @Type(()=>AssignDto)
    @IsNotEmpty()
    assign: Assign;

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