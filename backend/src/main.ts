import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwagger } from './configs/app/swagger';
import { setPipe } from './configs/app/pipes';
import { setCookieSession } from './configs/app/cookieSession';
import { setHeaders } from './configs/app/headers';
import path from 'path';

global.__baseDir = path.resolve(__dirname, '..', '..');

const PORT = process.env.PORT || 3000;

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setSwagger(app);
  setPipe(app);
  setCookieSession(app);
  setHeaders(app);
  await app.listen(PORT);
}
bootstrap();
