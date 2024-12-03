import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { TransformDtoInterceptor } from 'src/bases/transform-to-dto.interceptor';
import { AssignDto, CreateAssignDto, UpdateAssignDto } from './dto/assign.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { AssignService } from './assign.service';
import { Assign } from './assign.entity';
import { User } from 'src/user/user.decorator';
import { UserDto } from 'src/user/dto/user.dto';
import { IsTaskManagerGuard } from './assign-manager.guard';

@Controller('assign')
@UseInterceptors(new TransformDtoInterceptor(AssignDto))
@UseGuards(AuthGuard,RolesGuard)
export class AssignController {
    constructor(private readonly assignService: AssignService) {}

    @Post('')
    async assign(@Body(new ValidationPipe()) body:CreateAssignDto) : Promise<Assign>{
        return this.assignService.save(body);
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
