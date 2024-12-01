import { CanActivate, ExecutionContext, Global, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CustomRequest } from './interfaces/request.interface';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor (private authService:AuthService){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const accessToken = await this.authService.extractTokenFromHeader(request.headers.authorization);
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }
    return await this.authService.verifyAccessToken(accessToken)
    .then(payload=>{request.getUser = ()=> this.authService.getUserFromVerificationPayload(payload);return true})
    .catch(err=>{throw new UnauthorizedException('Invalid access token');});

  }
}
