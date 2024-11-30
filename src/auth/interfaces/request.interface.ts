
import { Request } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';

export interface CustomRequest extends Request{
    getUser():Promise<UserDto>
}