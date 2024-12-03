import { CanActivate, ExecutionContext, Global, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ProjectsService } from "src/projects/projects.service";
import { UserDto } from "src/user/dto/user.dto";
import { AssignService } from "./assign.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Assign } from "./assign.entity";


@Global()
@Injectable()
export class IsTaskManagerGuard implements CanActivate{

    constructor(private reflector:Reflector,private readonly assignService:AssignService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user:UserDto = request.getUser();
        const assignId = request.params.id;
        if (assignId){
            // in update mode
            const asssign = await this.assignService.findOne(assignId);
            return asssign.task.project.manager.userId == user.userId
        }




    }
}