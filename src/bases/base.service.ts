import { getRepositoryToken, InjectRepository } from "@nestjs/typeorm";
import { BaseEntity, EntitySchema, Repository } from "typeorm";

export interface BaseEntityService<T extends BaseEntity>{

    findAll(): Promise<T[]>;
    findOne(id: number): Promise<T>;
    save(entity: T): Promise<T>;
    // update(id: number, entity: T): Promise<T>;
    delete(id: number): Promise<void>;
}