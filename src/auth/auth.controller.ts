import { Body, Controller, Get, Header, Headers, HttpException, Post, UseGuards } from '@nestjs/common';
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

    @Post('verify')
    async verify(@Body("accessToken") accessToken: string) {
        return await this.authService.verifyToken(accessToken);
    }

    @Get('me')
    @Header('Content-Type', 'application/json')
    @UseGuards(AuthGuard)
    async getMe(): Promise<UserDto> {
        return await this.authService.getMe(accessToken);
    }

}

