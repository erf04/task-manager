import { Body, Controller, HttpCode, HttpException, HttpStatus, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UserService } from './../user/user.service';
import { AuthService } from './../auth/auth.service';
import { AddMemeberDto, CreateProjectDto, ProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ValidationPipe } from './validation.pipe';
import { User } from 'src/user/user.decorator';
import { UserDto } from 'src/user/dto/user.dto';
import { IsManagerGuard } from './projects.guard';

@UseGuards(AuthGuard,RolesGuard)
@Controller('projects')
export class ProjectsController {
constructor(private readonly projectsService: ProjectsService) {}

    @Post('members/add/')
    @Roles(Role.MANAGER,Role.ADMIN)
    async addMember(@Body(new ValidationPipe()) body: AddMemeberDto): Promise<ProjectDto> {
        return this.projectsService.addMember(body.projectId,body.userId);
    }

    @Post('create')
    @Roles(Role.MANAGER,Role.ADMIN)
    async create(@Body(new ValidationPipe()) project: CreateProjectDto,@User() user:UserDto): Promise<ProjectDto> {
        const isUnique=await this.projectsService.isUniqueProjectName(project.title,user)
        
        if (!isUnique){
            throw new HttpException('Project name must be unique', 400);

        }

        project.managerId=user.userId
        return this.projectsService.save(project);
        // return null;
    }

    @Post('members/remove/')
    @Roles(Role.MANAGER,Role.ADMIN)
    async removeMember(@Body(new ValidationPipe()) body: AddMemeberDto): Promise<ProjectDto> {
        return this.projectsService.removeMember(body.projectId,body.userId);
    }

    @Post('delete/:id')
    @Roles(Role.MANAGER,Role.ADMIN)
    @UseGuards(IsManagerGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: number ): Promise<void> {
        return this.projectsService.delete(id);
    }


    @Put('update/:id')
    @Roles(Role.MANAGER,Role.ADMIN)
    @UseGuards(IsManagerGuard)
    @HttpCode(HttpStatus.PARTIAL_CONTENT)
    async update(@Body(new ValidationPipe()) body: UpdateProjectDto,@Param('id') id: number):Promise<ProjectDto> {
        return this.projectsService.update(id,body);
    }
}
