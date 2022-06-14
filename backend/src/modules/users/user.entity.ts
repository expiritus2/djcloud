import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { RoleEntity } from '../roles/role.entity';

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

    @CreateDateColumn({ type: 'timestamp', nullable: false })
    createdAt: number;

    @UpdateDateColumn({ type: 'timestamp', nullable: false })
    updatedAt: number;
}
