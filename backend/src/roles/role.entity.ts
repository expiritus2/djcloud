import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../authentication/users/user.entity';

import { RolesEnum } from './roles.enum';

@Entity('roles')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: RolesEnum,
        default: RolesEnum.ADMIN,
    })
    name: RolesEnum;

    @OneToMany(() => UserEntity, (user) => user.role)
    users: UserEntity[];
}
