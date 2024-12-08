import { ApiProperty } from "@nestjs/swagger";
import { Assign } from "src/assign/assign.entity";
import { EventType } from "src/event/constants";
import { User } from "src/user/user.entity";
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class EventNotif{
    @PrimaryGeneratedColumn()
    id:number
    @Column({nullable:false})
    type:EventType

    @ManyToOne(()=>User,user=>user.eventNotifs)
    receiver:User

    @Column({type:'timestamp'})
    date:Date

    @ManyToOne(()=>Assign,assign => assign.eventNotifs)
    assign:Assign

    @Column({nullable:false,default:false})
    read:boolean

    @BeforeInsert()
    async setDate() {
        this.date=new Date();
    }
}