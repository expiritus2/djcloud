import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { RoleEntity } from '../../roles/role.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => RoleEntity, (role) => role.users)
    @JoinColumn({ name: 'roleId' })
    role: RoleEntity;

    @CreateDateColumn({ type: 'timestamptz', nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', nullable: false })
    updatedAt: Date;
}
