import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwagger } from './lib/configs/app/swagger';
import { setPipe } from './lib/configs/app/pipes';
import { setCookieSession } from './lib/configs/app/cookieSession';
import { setHeaders } from './lib/configs/app/headers';
import path from 'path';
import { EnvEnums } from './lib/configs/envs';

global.__baseDir = path.resolve(__dirname, '..', '..');

const PORT = process.env.PORT || 8000;
const ENV = process.env.ENVIRONMENT || EnvEnums.DEVELOPMENT;

const origin =
    ENV === EnvEnums.DEVELOPMENT || ENV === EnvEnums.TEST ? 'http://localhost:3000' : process.env.FRONTEND_DOMAIN;

console.log(ENV, origin);

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
