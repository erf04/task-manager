import { Body, HttpException, Injectable, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCreationDto, UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { rejects } from 'assert';
import { JWT_SECRET } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService:JwtService
    ) {}

    private async validateUser(username: string, password: string): Promise<any> {
        const user:User = await this.userService.findByUsername(username);
        if (user && await this.validatePassword(password,user.password)) {
          const result:UserDto = user.toUserDto();
          return result;
        }
        return null;
    }
    private async validatePassword(plainPass:string, hashedPass:string):Promise<boolean>{
        return bcrypt.compare(plainPass, hashedPass);

    }

    async login(username:string,password:string):Promise<{accessToken:string}>{
        const user = await this.validateUser(username,password);
        if(user){
            const payload = {username:user.username,sub:user.userId};
            return {accessToken:await this.jwtService.signAsync(payload)};
        }else{
            return null;
        }

    }

    private async hashPassword(password:string):Promise<string>{
        return bcrypt.hash(password, 10);
    }

    async signUp(user:UserCreationDto){
        user.password = await this.hashPassword(user.password);
        return await this.userService.save(user);
    }

    async verifyToken(accessToken:string):Promise<boolean>{
        return this.jwtService.verifyAsync(accessToken)
        .then(res=>true)
        .catch(err=>false);
    }

    async extractTokenFromHeader(header:string):Promise<string|null>{
        const [type,token] = header.split(' ');
        return type === 'Bearer' || 'JWT' ? token : null;
    }


}
