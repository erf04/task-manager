import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventNotif } from './notification.entity';
import { Repository, TypeORMError } from 'typeorm';
import { User } from 'src/user/user.entity';
import { UserDto } from 'src/user/dto/user.dto';
import { CreateEventNotifDto, EventNotifDto } from './dto/event-notif.dto';

@Injectable()
export class NotificationService {

    constructor(@InjectRepository(EventNotif) private readonly eventNotifRepository:Repository<EventNotif>){}

    async findAllByUser(user:UserDto):Promise<EventNotifDto[]>{
        const events = await this.eventNotifRepository.find({
            where:{
                receiver:{userId:user.userId}
            },
            relations:['assign','assign.user','assign.task','assign.task.project','assign.task.project.manager'],
            order:{date:'DESC'}
        });
        console.log(events);
        return events;
        
    }

    async save(eventNotifDto:CreateEventNotifDto):Promise<EventNotif>{
        const eventNotif = this.eventNotifRepository.create({receiver:{userId:eventNotifDto.receiverId},type:eventNotifDto.type,assign:{id:eventNotifDto.assignId}});
        return this.eventNotifRepository.save(eventNotif)
        .then((res:EventNotif)=>this.findOne(res.id))
        .catch((err:TypeORMError)=>{throw new HttpException(err.message,500)});
    }

    async findOne(id:number):Promise<EventNotif>{
        return this.eventNotifRepository.findOne({where:{id}});
    }

    async read(id:number):Promise<EventNotif>{
        const eventNotif = await this.findOne(id);
        eventNotif.read=true;
        return this.eventNotifRepository.save(eventNotif);
    }

}
