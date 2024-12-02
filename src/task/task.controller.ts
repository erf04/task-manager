import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/roles/role.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto, TaskDto, UpdateTaskDto } from './dto/task.dto';
import { IsManagerGuard } from 'src/projects/projects.guard';
import { IsManagerTaskGuard } from './is-manager.guard';

@Controller('tasks')
@UseGuards(AuthGuard,RolesGuard)
export class TaskController {

    constructor (private taskService:TaskService){}


    @Get('project/:projectId')
    @HttpCode(HttpStatus.OK)
    async findProjectTasks(@Param('projectId') projectId: number): Promise<Task[]> {
        // return a list of tasks for the given project
        return this.taskService.getTasks(projectId);

    }

    @Post('create/')
    @UseGuards(IsManagerTaskGuard)
    @HttpCode(HttpStatus.CREATED) 
    @Roles(Role.MANAGER,Role.ADMIN)
    async create(@Body(new ValidationPipe()) task:CreateTaskDto):Promise<TaskDto>{
        return this.taskService.create(task);
    }

    @Post('delete/:id')
    @UseGuards(IsManagerTaskGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id:number):Promise<void>{
        return this.taskService.delete(id);
    }

    @Put('update/:id')
    @UseGuards(IsManagerTaskGuard)
    @HttpCode(HttpStatus.PARTIAL_CONTENT)
    async update(@Param('id') id:number,@Body(new ValidationPipe()) task:UpdateTaskDto):Promise<TaskDto>{
        return this.taskService.update(id,task);
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getTask(@Param('id') id: number): Promise<TaskDto> {
        return this.taskService.findOne(id);    
    }


}
