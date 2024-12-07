import { Body, HttpException, Injectable, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCreationDto, UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { rejects } from 'assert';
import { JWT_ACCESS_LIFETIME, JWT_ACCESS_SECRET, JWT_REFRESH_LIFETIME, JWT_REFRESH_SECRET } from './constants';
import { TypeORMError } from 'typeorm';

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

    async login(username:string,password:string):Promise<{accessToken:string,refreshToken:string}>{
        const user = await this.validateUser(username,password);
        if(user){
            const payload = {username:user.username,sub:user.userId};
            return {
                accessToken:await this.jwtService.signAsync(payload,{secret:JWT_ACCESS_SECRET,expiresIn:JWT_ACCESS_LIFETIME}),
                refreshToken:await this.jwtService.signAsync(payload,{secret:JWT_REFRESH_SECRET,expiresIn:JWT_REFRESH_LIFETIME})
            };
        }else{
            return null;
        }

    }

    private async hashPassword(password:string):Promise<string>{
        return bcrypt.hash(password, 10);
    }

    async signUp(user:UserCreationDto):Promise<UserDto>{
        user.password = await this.hashPassword(user.password);
        return this.userService.save(user)
        .then(res=>this.userService.findOne(res.userId).then(user=>user.toUserDto()))
        .catch((err:TypeORMError)=>{throw new HttpException(err.message,500)});
    }

    async verifyAccessToken(accessToken:string):Promise<any>{
        return this.jwtService.verifyAsync(accessToken,{secret:JWT_ACCESS_SECRET})

    }
    async verifyRefreshToken(refreshToken:string):Promise<any>{
        return this.jwtService.verifyAsync(refreshToken,{secret:JWT_REFRESH_SECRET})

    }

    async extractTokenFromHeader(header:string):Promise<string|null>{
        const [type,token] = header.split(' ');
        return type === 'Bearer' || 'JWT' ? token : null;
    }

    async generateNewAccessToken(refreshToken:string):Promise<{accessToken:string}>{
        return this.verifyRefreshToken(refreshToken)
        .then(async (result)=>{
            const {iat,exp,...payload} = result;
            return this.jwtService.signAsync(payload,{secret:JWT_ACCESS_SECRET,expiresIn:JWT_ACCESS_LIFETIME})
            .then(accessToken=>({accessToken}))
            // .catch(()=>null);
        })
        // .catch(err=>null)

    }

    async getUserFromVerificationPayload(payload:any):Promise<UserDto>{
        const user = await this.userService.findOne(payload.sub);
        if(user){
             return user.toUserDto()
        }

        return null;
    }


}
