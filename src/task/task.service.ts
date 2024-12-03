import { HttpException, Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository, QueryBuilder, TypeORMError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto, TaskDto, UpdateTaskDto } from './dto/task.dto';
import { UpdateProjectDto } from 'src/projects/dto/project.dto';
import { plainToInstance } from 'class-transformer';
import { ProjectsService } from 'src/projects/projects.service';
import { IBaseEntityService } from 'src/bases/base.service';

@Injectable()
export class TaskService implements IBaseEntityService<Task>{

    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        private readonly projecService:ProjectsService
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
    async save(taskDto:CreateTaskDto):Promise<Task>{
        // console.log(task);
        const project= await this.projecService.findOne(taskDto.projectId);
        if(!project){
            throw new HttpException('Project not found',404);
        }
        const task = this.taskRepository.create({title:taskDto.title,description:taskDto.description,status:taskDto.status,project});
        return this.taskRepository.save(task);
    }

    async delete(id:number):Promise<void>{
        this.taskRepository.delete(id).then(res=>console.log(res)).catch(err=>{throw Error(err)});
    }

    async update(id:number,task:UpdateTaskDto):Promise<Task>{
        const queryBuilder=this.taskRepository.createQueryBuilder();        
        return queryBuilder.update(Task).set(task).where('id = :id', {id:id}).execute()
        .then(()=>this.findOne(id)).catch((err:TypeORMError)=>{throw new HttpException(err.message,500)});

    }


    async findOne(id: number): Promise<Task> {
        return this.taskRepository.findOne({where:{id},relations:['project','project.manager','project.participants']});   
 
    }

    async findAll(): Promise<Task[]> {
        return this.taskRepository.find({relations:['project','project.manager','project.participants']});
    }

    async toDto(entity: Task): Promise<any> {
        return this.toTaskDto(entity);
    }

}
