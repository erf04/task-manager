import { UUID } from "crypto";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, Int32, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProjectStatus } from "./project-status.enum";
import { ProjectDto } from "./dto/project.dto";
import { plainToClass, plainToInstance } from "class-transformer";


@Entity()
export class Project extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User,user=>user.projectsAsManager)
    manager:User

    @ManyToMany(()=>User,user=>user.projectsAsParticipant)
    @JoinTable({name:'project_participants'})
    participants:User[]

    @Column({nullable:false})
    title:string

    @Column({nullable:true})
    description:string

    @Column({type:'timestamp'})
    createDate:Date = new Date()

    @Column({nullable:false})
    status:ProjectStatus


    toProjectDto():ProjectDto{
        return plainToInstance(ProjectDto,this,{excludeExtraneousValues:true});
    }
}