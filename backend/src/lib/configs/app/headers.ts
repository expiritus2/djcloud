import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export const setHeaders = (app: INestApplication) => {
  app.use(helmet());
  (app as any).set('etag', false);
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });
};
