import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_ACCESS_LIFETIME, JWT_ACCESS_SECRET } from './constants';

@Module({
  imports:[UserModule,JwtModule.register({
    secret: JWT_ACCESS_SECRET,
    signOptions: { expiresIn: JWT_ACCESS_LIFETIME },
  })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
