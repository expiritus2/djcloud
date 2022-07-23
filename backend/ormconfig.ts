import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EnvEnums } from './src/lib/configs/envs';
import dotenv from 'dotenv';

dotenv.config();

const ORMConfig = {
    synchronize: false,
    cli: {
        migrationsDir: 'migrations',
    },
} as TypeOrmModuleOptions;

switch (process.env.ENVIRONMENT) {
    case EnvEnums.DEVELOPMENT:
        Object.assign(ORMConfig, {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'local',
            password: 'local',
            database: 'local',
            entities: ['**/*.entity.js'],
            migrationsRun: true,
            migrations: ['migrations/*.js', 'migrations/development/*.js'],
        } as TypeOrmModuleOptions);
        break;
    case EnvEnums.TEST:
        Object.assign(ORMConfig, {
            type: 'postgres',
            host: 'localhost',
            port: 5433,
            username: 'test',
            password: 'test',
            database: 'test',
            entities: ['**/*.entity{.ts,.js}'],
            migrationsRun: true,
            migrations: ['migrations/*.js', 'migrations/test/*.js'],
        });
        break;
    case EnvEnums.PRODUCTION:
        Object.assign(ORMConfig, {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: ['**/*.entity.js'],
            migrationsRun: true,
            migrations: ['migrations/*.js', 'migrations/production/*.js'],
            ssl: {
                rejectUnauthorized: false,
            },
        });
        break;
    default:
        throw new Error('Unknown environment');
}

const dataSource = new DataSource(ORMConfig as any);

export default dataSource;
