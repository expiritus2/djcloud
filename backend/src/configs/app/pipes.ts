import { INestApplication, ValidationPipe } from '@nestjs/common';

export const setPipe = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};
