import { CanActivate, ExecutionContext, Global, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "./role.enum";
import { ROLES_KEY } from "./roles.decorator";
import { CustomRequest } from "../interfaces/request.interface";


@Global()
@Injectable()
export class RolesGuard implements CanActivate{

    constructor(private reflector:Reflector) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        if (!requiredRoles) {
            return true;
        }

        const request:CustomRequest = context.switchToHttp().getRequest();
        const user = await request.getUser();
        return requiredRoles.some((role) => user.roles?.includes(role));



    }
}