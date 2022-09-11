import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from '../../roles/role.entity';
import { RolesEnum } from '../../roles/roles.enum';

import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    ) {}

    async create(email: string, password: string): Promise<UserEntity> {
        const role = await this.roleRepo.findOne({ where: { name: RolesEnum.USER } });
        const user = this.userRepo.create({ email, password, role });

        return this.userRepo.save(user);
    }

    async findOne(id: number): Promise<UserEntity> {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['role'] });

        if (!user) {
            throw new NotFoundException(`User with id: ${id} is not exists`);
        }

        return user;
    }

    async find(options: any): Promise<UserEntity[]> {
        return this.userRepo.find({ where: options, relations: ['role'] });
    }

    async remove(id: number): Promise<UserEntity> {
        const user = await this.findOne(id);

        return this.userRepo.remove(user);
    }
}
