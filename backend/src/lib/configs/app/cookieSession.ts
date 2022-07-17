import { INestApplication } from '@nestjs/common';
import session from 'express-session';

export const setCookieSession = (app: INestApplication) => {
    app.use(
        session({
            name: process.env.COOKIE_SESSION_NAME || 'session',
            secret: process.env.COOKIE_KEY,
            resave: false,
            saveUninitialized: false,
        }),
    );
};
