import { Controller } from '@nestjs/common';
import { Serialize } from '../../lib/interceptors/serialize.interceptor';
import { UserDto } from '../auth/dtos/user.dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {}
