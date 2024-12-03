import { Task } from "src/task/task.entity";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Assign extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>User,user=>user.assignedTasks)
    user:User

    @ManyToOne(()=>Task,task=>task.assigns)
    task:Task

    @Column()
    date:Date = new Date()

    @Column({nullable:true})
    description:string
 
}