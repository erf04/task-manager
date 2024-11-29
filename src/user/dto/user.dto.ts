import { User } from "../user.entity";

export class UserDto{
    userId:string;
    username:string;
    firstName?:string;
    lastName?:string;
}

export class UserCreationDto{ 
    username :string 
    firstName?:string 
    lastName?:string 
    password:string
}