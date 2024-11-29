import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class UserService {
    queryBuilder:SelectQueryBuilder<User>
    constructor(
        @InjectRepository(User) private userRepositoty:Repository<User>,
    ){  
        this.queryBuilder = this.userRepositoty.createQueryBuilder('user');
    }

    async getUserByUsername(username:string):Promise<User | null>{
        return this.queryBuilder.where('user.username = :username', {username}).getOne();
    }
    async getUserById(userId:UUID):Promise<User | null>{
        return this.queryBuilder.where('user.id = :id', {id:userId}).getOne();
    }

    createUser(user:User):Promise<User>{
        this.queryBuilder.insert().values(user).execute()
        .then(res => console.log(res))
        .catch(err=>console.log(err))
        return this.queryBuilder.getOne();
    }    






}
