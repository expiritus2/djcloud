import devConfig from './dev.json';
import prodConfig from './prod.json';
import testConfig from './test.json';

export enum EnvEnums {
  DEVELOPMENT = 'dev',
  PRODUCTION = 'prod',
  TEST = 'test',
}

const envMap = {
  [EnvEnums.DEVELOPMENT]: devConfig,
  [EnvEnums.PRODUCTION]: prodConfig,
  [EnvEnums.TEST]: testConfig,
};

export const env = process.env.ENVIRONMENT || 'dev';

export const envConfig = envMap[env];
