import { Body, Controller, Get, Header, Headers, HttpCode, HttpException, Logger, Post, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserCreationDto, UserDto } from 'src/user/dto/user.dto';
import { AuthGuard } from './auth.guard';
import { User } from 'src/user/user.decorator';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/role.enum';
import { RolesGuard } from './roles/roles.guard';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { ValidationPipe } from 'src/projects/validation.pipe';
import { LoginDto, LoginResponseDto } from './dto/auth.dto';
import { stringify } from 'querystring';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    @ApiResponse({ status: 200, description: 'Returns access and refresh tokens',type:()=>(LoginResponseDto) })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body(new ValidationPipe()) loginDto:LoginDto,@Res() res:Response): Promise<LoginResponseDto | any> {
        const accessToken = await this.authService.login(loginDto.username,loginDto.password)
        if (accessToken){
            this.logger.debug(`user ${loginDto.username} logged in`);
            return res.status(200).json(accessToken);
        }
        return res.status(401).json({message:"Invalid credentials"});   

    }

    @Post('signup')
    @ApiResponse({ status: 200, description: 'Returns user object',type:()=>(UserDto) })
    @ApiResponse({ status: 400, description: 'bad request' })
    async signup(@Body() user:UserCreationDto):Promise<UserDto> {
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
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    async getMe(@User() user): Promise<UserDto> {
        // return await this.authService.getMe(accessToken);
        return user;
    }

}

