import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { ProjectStatus } from "../project-status.enum";
import { UserDto } from "src/user/dto/user.dto";
import { Expose, Type } from "class-transformer";


export class ProjectDto{
    @Expose()
    id: number;
    @Expose()
    title: string;
    @Expose()
    description: string;
    @Expose()
    @Type(() => UserDto)
    manager:UserDto;
    @Expose()
    status: ProjectStatus;
    @Expose()
    @Type(() => UserDto)
    participants: UserDto[];
}

export class CreateProjectDto{
    @IsNotEmpty()
    title: string;
  
    @IsOptional()
    description?: string;
  
    @IsNotEmpty()
    @IsEnum(ProjectStatus)
    status: ProjectStatus;
  
    @IsOptional()
    managerId: number;
  
    @IsOptional()
    @IsArray()
    participantIds?: number[];

}

export class AddMemeberDto{
    @IsNotEmpty()
    @IsInt()
    projectId: number;

    @IsNotEmpty()
    @IsInt()
    userId: number;
}


export class UpdateProjectDto{
    @Expose()
    @IsOptional()
    id: number;
    @Expose()
    @IsOptional()
    title: string;
    @Expose()
    @IsOptional()
    description: string;
    @Expose()
    @IsOptional()
    status: ProjectStatus;
}