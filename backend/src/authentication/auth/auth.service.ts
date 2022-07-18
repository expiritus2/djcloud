import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { getHashPassword } from '../lib/utils';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private configService: ConfigService) {}

    async signup(email: string, password: string): Promise<UserEntity> {
        const users = await this.usersService.find({ email });

        if (users.length) {
            throw new BadRequestException('Email in use');
        }

        const hashPassword = await getHashPassword(password, this.configService.get('SALT'));

        return await this.usersService.create(email, hashPassword);
    }

    async signin(email: string, password: string): Promise<UserEntity> {
        const [user] = await this.usersService.find({ email });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const storedHashPassword = user.password;

        const hashPassword = await getHashPassword(password, this.configService.get('SALT'));
        if (storedHashPassword !== hashPassword) {
            throw new BadRequestException('Email or password not valid');
        }

        return user;
    }
}
