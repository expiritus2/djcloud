import { Controller } from '@nestjs/common';

import { Serialize } from '../lib/interceptors/serialize.interceptor';

import { UserDto } from './dtos/user.dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {}
