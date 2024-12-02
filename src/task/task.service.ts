import { HttpException, Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository, QueryBuilder, TypeORMError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto, TaskDto, UpdateTaskDto } from './dto/task.dto';
import { UpdateProjectDto } from 'src/projects/dto/project.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>
    ){}


    async getTasks(projectId:number):Promise<Task[]>{
        return this.taskRepository.find({
            where:{
                project:{id:projectId}
            }});

    }    

    async toTaskDto(task:Task):Promise<TaskDto>{
        return plainToInstance(TaskDto,task,{excludeExtraneousValues:true});
    }
    async create(task:CreateTaskDto):Promise<TaskDto>{
        return this.taskRepository.save(task).then(task=>this.toTaskDto(task));
    }

    async delete(id:number):Promise<void>{
        this.taskRepository.delete(id).then(res=>console.log(res)).catch(err=>{throw Error(err)});
    }

    async update(id:number,task:UpdateTaskDto):Promise<TaskDto>{
        const queryBuilder=this.taskRepository.createQueryBuilder();        
        return queryBuilder.update(Task).set(task).where('id = :id', {id:id}).execute()
        .then(()=>this.findOne(id).then(task=>this.toTaskDto(task))).catch((err:TypeORMError)=>{throw new HttpException(err.message,500)});
    }


    async findOne(id: number): Promise<Task> {
        return this.taskRepository.findOne({where:{id}});    
    }

}
