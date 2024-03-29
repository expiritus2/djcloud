import { Body, Controller, Get, HttpCode, Post, Session } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { Serialize } from '../lib/interceptors/serialize.interceptor';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserDto } from '../users/dtos/user.dto';
import { UserEntity } from '../users/user.entity';

import { SuccessDto } from './dtos/success';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, type: UserDto })
  async signup(@Body() body: CreateUserDto, @Session() session: any): Promise<UserEntity> {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Post('/signin')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({ status: 200, type: UserDto })
  @HttpCode(200)
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Get('/whoami')
  @Serialize(UserDto)
  @ApiOperation({ summary: 'Return authenticated user' })
  @ApiResponse({ status: 200, type: UserDto })
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Get('/signout')
  @Serialize(SuccessDto)
  @ApiOperation({ summary: 'Signout user' })
  signOut(@Session() session: any) {
    session.userId = null;
    return { success: true };
  }
}
