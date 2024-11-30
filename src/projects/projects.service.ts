import { Injectable } from '@nestjs/common';
import { BaseEntityService } from './../bases/base.service';
import { Project } from './project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class ProjectsService implements BaseEntityService<Project>{

    queryBuilder:SelectQueryBuilder<Project>;
    constructor(
        @InjectRepository(Project) private projectRepository:Repository<Project>
    ){
        this.queryBuilder=this.projectRepository.createQueryBuilder();
    }


    async findAll(): Promise<Project[]> {
        return this.projectRepository.find();
    }

    async findOne(id: number): Promise<Project> {
        this.queryBuilder.where('project.id = :id', {id});
        return this.queryBuilder.getOne();
    }

    async save(entity: Project): Promise<Project> {
        return this.projectRepository.save(entity);
    }

    async delete(id: number): Promise<void> {
        this.projectRepository.delete(id).then(res=>console.log(res)).catch(err=>{throw Error(err)});
    }





}
