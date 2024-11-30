import { Body, Controller, Get, Header, Headers, HttpException, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserCreationDto, UserDto } from 'src/user/dto/user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    async login(@Body("username") username: string, @Body("password") password: string): Promise<{accessToken:string} | any> {
        const accessToken = await this.authService.login(username,password)
        return accessToken?accessToken:new HttpException('Invalid credentials', 401);

    }

    @Post('signup')
    async signup(@Body() user:UserCreationDto) {
        return await this.authService.signUp(user);
    }

    @Post('access/verify')
    async accessTokenVerify(@Body("accessToken") accessToken: string) {
        const user = await this.authService.verifyAccessToken(accessToken)
        .then(user=>user)
        .catch(err=>null);
        return user? new HttpException('Access token is valid', 200):new HttpException('Access token is invalid', 401);
    }

    @Post('refresh/verify')
    async refreshTokenVerify(@Body("refreshToken") refreshToken: string) {
        const user = await this.authService.verifyRefreshToken(refreshToken)
        .then(user=>user)
        .catch(err=>null);
        return user? new HttpException('refresh token is valid', 200):new HttpException('refresh token is invalid', 401);
    }


    @Post('refresh')
    async refresh(@Body("refreshToken") refreshToken: string) {
        return await this.authService.generateNewAccessToken(refreshToken)
        .then(accessToken=>accessToken)
        .catch(()=> {throw new HttpException('Refresh token is invalid', 401);});
    }

    @Get('me')
    @Header('Content-Type', 'application/json')
    @UseGuards(AuthGuard)
    async getMe(@Request() req): Promise<UserDto> {
        // return await this.authService.getMe(accessToken);
        return req.getUser();
    }

}

