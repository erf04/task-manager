import { TaskStatus } from "src/task/task-status.enum";
import { Task } from "src/task/task.entity";
import { User } from "src/user/user.entity";
import { AfterInsert, AfterUpdate, BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


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

    @AfterInsert()
    updateTaskStatus(){
        this.task.status = TaskStatus.IN_PROGRESS;
    }


 
}