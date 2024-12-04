import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseEntityService } from 'src/bases/base.service';
import { Assign } from './assign.entity';
import { Repository } from 'typeorm';
import { AssignDto, CreateAssignDto, UpdateAssignDto } from './dto/assign.dto';
import { TaskService } from 'src/task/task.service';
import { UserService } from 'src/user/user.service';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/user/dto/user.dto';
import { EventGateway } from './../event/event.gateway';

@Injectable()
export class AssignService implements IBaseEntityService<Assign>{
    constructor(
        @InjectRepository(Assign) private readonly assignRepository:Repository<Assign>,
        private readonly taskService:TaskService,
        private readonly userService:UserService,
        private readonly eventGateway:EventGateway
    ){
    }

    async findOne(id: number): Promise<Assign> {
        return this.assignRepository.findOne({
            where:{id},
            relations:['user','task','task.project','task.project.manager']
        });
    }

    async findAll():Promise<Assign[]>{
        return this.assignRepository.find({
            relations:['user','task','task.project','task.project.manager']
        });
    }

    async save(entity: CreateAssignDto): Promise<Assign> {
        const task=await this.taskService.findOne(entity.taskId);
        if (!task) {
            throw new HttpException('Task not found', 404);  
        }
        const user=await this.userService.findOne(entity.userId);
        if (!user) {
            throw new HttpException('User not found', 404);  
        }
        const assign = this.assignRepository.create({task,user});
        return this.assignRepository.save(assign)
        .then(async(res)=>{
            const assign= await this.findOne(res.id);
            this.eventGateway.sendAssignmentNotification(await this.toDto(assign));
            return assign
        }).catch(err=>{throw Error(err)});
    }

    async delete(id: number): Promise<void> {
        await this.assignRepository.delete(id);
    }

    async toDto(entity: Assign): Promise<any> {
        return plainToInstance(AssignDto, entity, {
            excludeExtraneousValues: true,
        })
    }

    async update(id: number, entityDto: UpdateAssignDto): Promise<Assign> {
        const user=await this.userService.findOne(entityDto.userId);
        const task=await this.taskService.findOne(entityDto.taskId);
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        if (!task) {
            throw new HttpException('Task not found', 404);
        }
        const entity = {
            description : entityDto.description,
            user,
            task
        }
        return this.assignRepository.createQueryBuilder().update(Assign).set(entity).where("id = :id",{id}).execute()
        .then(res=>this.findOne(id)).catch(err=>{throw Error(err)});
    }

    async findAllByUser(user:UserDto):Promise<Assign[]>{
        return this.assignRepository.find({
            where:{user:{userId:user.userId}}
            ,relations:['task','task.project','task.project.manager']}
        )
    }
}
