import { Expose, Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { TaskDto } from "src/task/dto/task.dto";
import { Task } from "src/task/task.entity";
import { UserDto } from "src/user/dto/user.dto";
import { User } from "src/user/user.entity";
import { IsProjectManagerConstraint } from "../validation/is-project-manager";

export class AssignDto{
    @Expose()
    @IsNumber()
    id:number

    @Expose()
    @Type(()=>UserDto)
    user:UserDto;

    @Expose()
    @Type(()=>TaskDto)
    task:TaskDto;

    @Expose()
    @IsDate()
    date:Date

    @Expose()
    @IsString()
    @IsOptional()
    description:string
}   


export class CreateAssignDto{
    @Expose()
    @IsNumber()
    @Validate(IsProjectManagerConstraint, { message: 'You are not the manager of the project containing this task' })
    taskId:number

    @Expose()
    @IsNumber()
    userId:number   

    @Expose()
    @IsString()
    @IsOptional()
    description?:string

}

export class UpdateAssignDto{
    @Expose()
    @IsNumber()
    taskId:number

    @Expose()
    @IsNumber()
    userId:number

    @Expose()
    @IsString()
    @IsOptional()
    description?:string
}