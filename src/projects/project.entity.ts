import { UUID } from "crypto";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProjectStatus } from "./project-status.enum";


@Entity()
export class Project extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: UUID;

    @ManyToOne(()=>User,user=>user.projectsAsManager)
    manager:User

    @ManyToMany(()=>User,user=>user.projectsAsParticipant)
    @JoinTable({name:'project_participants'})
    participants:User[]

    @Column({nullable:false})
    title:string

    @Column({nullable:true})
    description:string

    @Column()
    createDate:Date

    @Column({nullable:false})
    status:ProjectStatus
}