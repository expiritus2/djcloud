import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwagger } from './configs/app/swagger';
import { setPipe } from './configs/app/pipes';
import { setCookieSession } from './configs/app/cookieSession';
import { setHeaders } from './configs/app/headers';
import path from 'path';

global.__baseDir = path.resolve(__dirname, '..', '..');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const origin = ENV === 'development' ? 'http://localhost:3000' : '';

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    setSwagger(app);
    setPipe(app);
    setCookieSession(app);
    setHeaders(app);
    app.enableCors({ origin, credentials: true });
    await app.listen(PORT);
}
bootstrap();
