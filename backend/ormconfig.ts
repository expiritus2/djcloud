import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { EnvEnums } from './src/lib/configs/envs';

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
            migrations: ['migrations/*.js', `migrations/${EnvEnums.DEVELOPMENT}/*.js`],
        } as TypeOrmModuleOptions);
        break;
    case EnvEnums.TEST:
        if (process.env.TEST_TYPE === 'e2e') {
            Object.assign(ORMConfig, {
                type: 'postgres',
                host: 'db',
                port: 5432,
                username: 'test',
                password: 'test',
                database: 'test',
                entities: ['**/*.entity.js'],
                migrationsRun: true,
                migrations: ['migrations/*.js', `migrations/${EnvEnums.TEST}/*.js`],
            });
        } else {
            Object.assign(ORMConfig, {
                type: 'postgres',
                host: 'localhost',
                port: 5433,
                username: 'test',
                password: 'test',
                database: 'test',
                entities: ['**/*.entity{.js,.ts}'],
                migrationsRun: true,
                migrations: ['migrations/*.js', `migrations/${EnvEnums.TEST}/*.js`],
            });
        }
        break;
    case EnvEnums.PRODUCTION:
        Object.assign(ORMConfig, {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: ['**/*.entity.js'],
            migrationsRun: true,
            migrations: ['migrations/*.js', `migrations/${EnvEnums.PRODUCTION}/*.js`],
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
