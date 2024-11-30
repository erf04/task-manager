import { Optional } from "@nestjs/common";
import { UUID } from "crypto";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { plainToInstance } from "class-transformer";
import { Role } from "src/auth/roles/role.enum";
import { Project } from "src/projects/project.entity";


@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    userId:UUID

    @Column({
        unique:true
    })
    username:string
    
    @Column({nullable:true})
    
    firstName:string 
    @Column({nullable:true})
    lastName:string

    @Column()
    password:string 

    @Column({type:'simple-array'})
    roles:Role[]

    @OneToMany(()=>Project,project=>project.manager)
    projectsAsManager:Project[]

    @ManyToMany(()=>Project,project=>project.participants)
    projectsAsParticipant:Project[]

    


    toUserDto():UserDto{
        // return {userId:this.userId,username:this.username,firstName:this.firstName,lastName:this.lastName}
        return plainToInstance(UserDto,this,{excludeExtraneousValues:true});
    }
}