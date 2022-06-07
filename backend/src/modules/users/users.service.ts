import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RoleEntity } from '../roles/role.entity';
import { RolesEnum } from '../roles/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
  ) {}

  async create(email: string, password: string): Promise<UserEntity> {
    const role = await this.roleRepo.findOne({ name: RolesEnum.USER });
    const user = this.userRepo.create({ email, password, role });

    return this.userRepo.save(user);
  }

  async findOne(id: string | number): Promise<UserEntity> {
    const user = await this.userRepo.findOne(id, { relations: ['role'] });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not exists`);
    }

    return user;
  }

  find(options: any): Promise<UserEntity[]> {
    return this.userRepo.find({ relations: ['role'], where: options });
  }

  async remove(id: number): Promise<UserEntity> {
    const user = await this.findOne(id);

    return this.userRepo.remove(user);
  }
}
