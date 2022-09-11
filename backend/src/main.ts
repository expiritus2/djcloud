import { NestFactory } from '@nestjs/core';
import path from 'path';

import { setCookieSession } from './lib/configs/app/cookieSession';
import { setHeaders } from './lib/configs/app/headers';
import { setPipe } from './lib/configs/app/pipes';
import { setSwagger } from './lib/configs/app/swagger';
import { EnvEnums } from './lib/configs/envs';
import { AppModule } from './app.module';

global.__baseDir = path.resolve(__dirname, '..', '..');

const PORT = process.env.PORT || 8000;
const ENV = process.env.ENVIRONMENT || EnvEnums.DEVELOPMENT;

const origin =
    ENV === EnvEnums.DEVELOPMENT || ENV === EnvEnums.TEST ? 'http://localhost:3000' : process.env.FRONTEND_DOMAIN;

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    setSwagger(app);
    setPipe(app);
    setCookieSession(app);
    setHeaders(app);
    app.enableCors({ origin, credentials: true });
    await app.listen(PORT);
}
bootstrap();
