import { HttpException, Injectable } from '@nestjs/common';
import { BaseEntityService } from './../bases/base.service';
import { Project } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { UUID } from 'crypto';
import { UserService } from 'src/user/user.service';
import { CreateProjectDto, ProjectDto } from './dto/project.dto';
import { UserDto } from './../user/dto/user.dto';

@Injectable()
export class ProjectsService{

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

    async save(projectDto: CreateProjectDto): Promise<ProjectDto> {
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
        return (await this.projectRepository.save(project)).toProjectDto();
    }

    async delete(id: number): Promise<void> {
        this.projectRepository.delete(id).then(res=>console.log(res)).catch(err=>{throw Error(err)});
    }

    async addMember(projectId:number,userId:number):Promise<ProjectDto>{
        
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
        return (await this.projectRepository.save(project)).toProjectDto();

    }

    async removeMember(projectId:number,userId:number):Promise<ProjectDto>{
        const project = await this.findOne(projectId);
        
        project.participants = project.participants.filter(user=>user.userId!==userId);
        return (await this.projectRepository.save(project)).toProjectDto();
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






}
