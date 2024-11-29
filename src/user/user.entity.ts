import { UUID } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    userId:UUID

    @Column({
        unique:true
    })
    username:string
    
    @Column()
    firstName:string 
    @Column()
    lastName:string
}