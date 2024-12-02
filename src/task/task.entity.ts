import { Project } from "src/projects/project.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status.enum";
import { TaskDto } from "./dto/task.dto";
import { plainToInstance } from "class-transformer";

@Entity()
export class Task{
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


}