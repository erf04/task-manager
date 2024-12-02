import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ProjectsService } from './projects.service';

@Injectable()
export class IsManagerGuard implements CanActivate {
  constructor(private projectService:ProjectsService){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user =await request.getUser();
    const projectId=request.params.id
    
    const project=await this.projectService.findOne(projectId);
    return project.manager.userId===user.userId
    // return true;
  }
}
