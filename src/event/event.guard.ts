import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Socket } from 'socket.io';

@Injectable()
export class EventGuard implements CanActivate {
  private readonly logger:Logger = new Logger(EventGuard.name)
  constructor(private readonly authService:AuthService){

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const client = context.switchToWs().getClient()
    const authToken = client.handshake.headers.authorization
    this.logger.log(authToken);
    const accessToken = await this.authService.extractTokenFromHeader(authToken);
    return this.authService.verifyAccessToken(accessToken)
    .then(payload=>{
      const user = this.authService.getUserFromVerificationPayload(payload);
      if (!user)
        throw new UnauthorizedException('User not found');
      client.getUser = ()=> user;
      return true;
    }).catch(err=>{throw new UnauthorizedException('Invalid access token');});
    // return false; 
  }
}
