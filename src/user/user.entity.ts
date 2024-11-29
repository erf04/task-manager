import { Optional } from "@nestjs/common";
import { UUID } from "crypto";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserDto } from "./dto/user.dto";


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


    toUserDto():UserDto{
        return {userId:this.userId,username:this.username,firstName:this.firstName,lastName:this.lastName}
    }
}