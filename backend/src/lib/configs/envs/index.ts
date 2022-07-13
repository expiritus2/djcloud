import devConfig from './development.json';
import prodConfig from './production.json';
import testConfig from './test.json';

enum EnvEnums {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
}

const envMap = {
    [EnvEnums.DEVELOPMENT]: devConfig,
    [EnvEnums.PRODUCTION]: prodConfig,
    [EnvEnums.TEST]: testConfig,
};

export const env = process.env.NODE_ENV || 'development';

export const envConfig = envMap[env];
