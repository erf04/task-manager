import { getRepositoryToken, InjectRepository } from "@nestjs/typeorm";
import { BaseEntity, EntitySchema, Repository } from "typeorm";

export interface IBaseEntityService<T extends BaseEntity>{

    findAll(): Promise<T[]>;
    findOne(id: number): Promise<T>;
    save(entity: any): Promise<T>;
    update(id: number, entityDto: any): Promise<T>;
    delete(id: number): Promise<void>;
    toDto(entity: T): Promise<any>;
}