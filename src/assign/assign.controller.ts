import { Body, Controller, Get, HttpException, Param, Post, Put, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { TransformDtoInterceptor } from 'src/bases/transform-to-dto.interceptor';
import { AssignDto, CreateAssignDto, UpdateAssignDto } from './dto/assign.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { AssignService } from './assign.service';
import { Assign } from './assign.entity';
import { User } from 'src/user/user.decorator';
import { UserDto } from 'src/user/dto/user.dto';
import { IsTaskManagerGuard } from './assign-manager.guard';
import { TaskService } from 'src/task/task.service';

@Controller('assign')
@UseInterceptors(new TransformDtoInterceptor(AssignDto))
@UseGuards(AuthGuard,RolesGuard)
export class AssignController {
    constructor(
        private readonly assignService: AssignService,
        private readonly taskService:TaskService,
    ) {}

    @Post('')
    async assign(@Body(new ValidationPipe()) body:CreateAssignDto,@User() user:UserDto) : Promise<Assign>{
        const task = await this.taskService.findOne(body.taskId);
        if(!task) throw new HttpException('Task not found',404);
        if (task.project.manager.userId===user.userId){
            return this.assignService.save(body);   
        }
        throw new HttpException('You are not the task manager',403);

    }


    @Put('/update/:id')
    @UseGuards(IsTaskManagerGuard)
    async update(@Param('id') id: number, @Body(new ValidationPipe()) body: UpdateAssignDto):Promise<Assign>{
        return this.assignService.update(id,body);
    }

    @Get('/mine')
    async findAllByUser(@User() user:UserDto) : Promise<Assign[]>{
        return this.assignService.findAllByUser(user);
    }


}
