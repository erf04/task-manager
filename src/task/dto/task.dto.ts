import { Expose, Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ProjectDto } from "src/projects/dto/project.dto";
import { Project } from "src/projects/project.entity";
import { TaskStatus } from "../task-status.enum";


export class TaskDto{
    @Expose()
    id: number;
    @Expose()
    title: string;
    @Expose()
    description: string;
    @Expose()
    status: string;
    @Expose()
    @Type(() => ProjectDto)
    project:ProjectDto
}


export class UpdateTaskDto{
    @IsOptional()
    @IsString()
    @Expose()
    title: string;

    @IsOptional()
    @IsString()
    @Expose()
    description: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    @Expose()
    status: TaskStatus;



}

export class CreateTaskDto{
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsOptional()
    @IsString()
    description: string;
    @IsNotEmpty()
    @IsNumber()
    projectId: number;
    @IsOptional()
    @IsEnum(TaskStatus)
    status:TaskStatus
}