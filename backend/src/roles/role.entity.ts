import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEnum } from './roles.enum';
import { UserEntity } from '../users/user.entity';

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
