import { HttpException, Injectable } from '@nestjs/common';
import { IBaseEntityService } from './../bases/base.service';
import { Project } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { UUID } from 'crypto';
import { UserService } from 'src/user/user.service';
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from './dto/project.dto';
import { UserDto } from './../user/dto/user.dto';

@Injectable()
export class ProjectsService implements IBaseEntityService<Project> {

    queryBuilder:SelectQueryBuilder<Project>;
    constructor(
        @InjectRepository(Project) private projectRepository:Repository<Project>,
        private userService:UserService
    ){
        this.queryBuilder=this.projectRepository.createQueryBuilder();
    }


    async findAll(): Promise<Project[]> {
        return this.projectRepository.find();
    }

    async findOne(id: number): Promise<Project> {
        const result =await this.projectRepository.findOne({where:{id},relations:['manager','participants']});
        // console.log(result);
        return result
        

    }

    async save(projectDto: CreateProjectDto): Promise<Project> {
        const { managerId,participantIds } = projectDto;
        const manager = await this.userService.findOne(managerId);
        const participants = participantIds && participantIds.length > 0 ? await this.userService.findMany(participantIds):[];
        const project = this.projectRepository.create({
            title:projectDto.title,
            description:projectDto.description,
            status:projectDto.status,
            manager,
            participants
        });
        return (await this.projectRepository.save(project));
    }

    async delete(id: number): Promise<void> {
        this.projectRepository.delete(id).then(res=>console.log(res)).catch(err=>{throw Error(err)});
    }

    async addMember(projectId:number,userId:number):Promise<Project>{
        const project = await this.projectRepository.findOne({  
            where:{id:projectId},relations:['manager']
        });
        if (!project){
            throw new HttpException('Project not found', 404);
        }
        if (project.manager.userId===userId){
            throw new HttpException('Manager cannot be added', 400);
        }
        const user=await this.userService.findOne(userId);
        project.participants? project.participants.push(user):project.participants=[user];
        return this.projectRepository.save(project);

    }

    async removeMember(projectId:number,userId:number):Promise<Project>{
        const project = await this.findOne(projectId);
        
        project.participants = project.participants.filter(user=>user.userId!==userId);
        return this.projectRepository.save(project);
    }

    async isUniqueProjectName(projectName:string,user:UserDto):Promise<boolean>{

        // const projects=(await this.userService.findOne(user.userId)).projectsAsManager;
        const projects = await this.queryBuilder.where('managerUserId = :managerId',{managerId:user.userId}).getMany();
        console.log(projects);
        
        for (let i = 0; i < projects.length; i++) {
            const element = projects[i];
            if (element.title===projectName){
                return false;                
            }
        }
        return true;
    }

    async update(projectId:number,projectDto:UpdateProjectDto):Promise<Project>{
        return this.queryBuilder.update(Project).set(projectDto).where('id = :id', {id:projectId}).execute()
        .then(async(res)=>{
        console.log(res)
            return (await this.findOne(projectId));
        }).catch(err=>{throw Error(err)});
    }

    async toDto(entity: Project): Promise<any> {
        return entity.toProjectDto();
    }






}
