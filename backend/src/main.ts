import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwagger } from './lib/configs/app/swagger';
import { setPipe } from './lib/configs/app/pipes';
import { setCookieSession } from './lib/configs/app/cookieSession';
import { setHeaders } from './lib/configs/app/headers';
import path from 'path';
import helmet from 'helmet';

global.__baseDir = path.resolve(__dirname, '..', '..');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const origin = ENV === 'development' ? 'http://localhost:3000' : process.env.FRONTEND_DOMAIN;

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    setSwagger(app);
    setPipe(app);
    setCookieSession(app);
    app.use(helmet());
    setHeaders(app);
    app.enableCors({ origin, credentials: true });
    await app.listen(PORT);
}
bootstrap();
