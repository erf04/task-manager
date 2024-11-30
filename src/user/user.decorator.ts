import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CustomRequest } from "src/auth/interfaces/request.interface";


export const User = createParamDecorator(
    (data: unknown, ctx:ExecutionContext) =>{
        const request:CustomRequest = ctx.switchToHttp().getRequest();
        return request.getUser();
    }
)