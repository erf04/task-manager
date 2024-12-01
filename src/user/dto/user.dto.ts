import { Expose } from "class-transformer";
import { User } from "../user.entity";
import { Role } from "src/auth/roles/role.enum";

export class UserDto{
    @Expose()
    userId:number;
    @Expose()
    username:string;
    @Expose()
    firstName?:string;
    @Expose()
    lastName?:string;
    @Expose()
    roles:Role[]
}

export class UserCreationDto{ 
    username :string 
    firstName?:string 
    lastName?:string 
    password:string
    
}