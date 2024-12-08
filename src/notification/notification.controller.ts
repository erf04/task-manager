import { Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TransformDtoInterceptor } from 'src/bases/transform-to-dto.interceptor';
import { EventNotifDto } from './dto/event-notif.dto';
import { User } from 'src/user/user.decorator';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('notification')
@UseGuards(AuthGuard)
@UseInterceptors(new TransformDtoInterceptor(EventNotifDto))
export class NotificationController {
    constructor(private readonly notificationService:NotificationService){}

    @Post('read/:id/')
    async read(@Param('id') id:number){
        return this.notificationService.read(id);
    }

    @Get('all/')
    async findAllByUser(@User() user:UserDto):Promise<EventNotifDto[]>{
        return this.notificationService.findAllByUser(user);
    }
}
