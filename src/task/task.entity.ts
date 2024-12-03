import { Project } from "src/projects/project.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.enum";
import { TaskDto } from "./dto/task.dto";
import { plainToInstance } from "class-transformer";
import { Assign } from "src/assign/assign.entity";

@Entity()
export class Task extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    title:string

    @Column({nullable:true})
    description:string

    @ManyToOne(()=>Project,project=>project.tasks)
    project:Project

    @Column({nullable:false,default:TaskStatus.NOT_ASSIGNED})
    status:TaskStatus

    @OneToMany(()=>Assign,assign=>assign.task)
    assigns:Assign[]


}