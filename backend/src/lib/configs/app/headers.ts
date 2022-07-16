import { INestApplication } from '@nestjs/common';

export const setHeaders = (app: INestApplication) => {
    (app as any).set('etag', false);
    app.use((req, res, next) => {
        res.removeHeader('x-powered-by');
        res.removeHeader('date');
        next();
    });
};
