import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const User = createParamDecorator(
    (data:unknown,ctx:ExecutionContext)=>{
        const client = ctx.switchToWs().getClient();
        return client.getUser();
    }
)
