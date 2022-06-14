const dbConfig = {
    synchronize: false,
    migrations: ['migrations/*.js'],
    cli: {
        migrationsDir: 'migrations',
    },
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'local',
            password: 'local',
            database: 'local',
            entities: ['**/*.entity.js'],
            synchronize: false,
            migrations: [...dbConfig.migrations, 'migrations/development/*.js'],
        });
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'postgres',
            host: 'localhost',
            port: 5433,
            username: 'test',
            password: 'test',
            database: 'test',
            entities: ['**/*.entity{.ts,.js}'],
            synchronize: false,
            migrationsRun: true,
            migrations: [...dbConfig.migrations, 'migrations/test/*.js'],
        });
        break;
    case 'production':
        Object.assign(dbConfig, {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            migrationsRun: true,
            entities: ['**/*.entity{.ts,.js}'],
            ssl: {
                rejectUnauthorized: false,
            },
        });
        break;
    default:
        throw new Error('Unknown environment');
}

module.exports = dbConfig;
