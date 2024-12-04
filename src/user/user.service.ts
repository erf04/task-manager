import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { QueryBuilder, Repository, SelectQueryBuilder, TypeORMError } from 'typeorm';
import { UUID } from 'crypto';
import { UserCreationDto, UserDto, UserUpdateDto } from './dto/user.dto';
import { IBaseEntityService } from './../bases/base.service';

@Injectable()
export class UserService implements IBaseEntityService<User>{
    queryBuilder:SelectQueryBuilder<User>
    constructor(
        @InjectRepository(User) private userRepository:Repository<User>,
    ){  
        this.queryBuilder = this.userRepository.createQueryBuilder('user');
    }

    async findByUsername(username:string):Promise<User | null>{
        return this.queryBuilder.where('user.username = :username', {username}).getOne();
    }


    async save(user:UserCreationDto):Promise<any>{
        return this.queryBuilder.insert().values(user).execute()
        .then(res =>{ return user})
        .catch((err:TypeORMError)=>{throw new HttpException(err.message,500)})
        
    }    

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        return this.userRepository.findOne({where:{userId:id},relations:['projectsAsManager','projectsAsParticipant']});
    }

    async delete(id: number): Promise<void> {
        this.userRepository.delete(id).then(res=>console.log(res)).catch(err=>{throw Error(err)});
    }


    async findMany(ids: number[]): Promise<User[]> {
        return this.queryBuilder.where('user.userId IN (:...ids)', {ids}).getMany();
        // this.userRepository.find({where:{userId:ids}});
    }

    async update(id: number, entity: UserUpdateDto): Promise<User> {
        return this.queryBuilder.update(User).set(entity).where('user.userId = :id', {id}).execute()
        .then(()=>this.findOne(id)).catch((err:TypeORMError)=>{throw new HttpException(err.message,500)});
    }

    async toDto(entity: User): Promise<any> {
        return entity.toUserDto();
    }









}
