import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('createZipStatus')
export class CreateZipStatusEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isFinished: boolean;

    @Column()
    pathToFile: string;
}
