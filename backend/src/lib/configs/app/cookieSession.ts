import { INestApplication } from '@nestjs/common';
import session from 'express-session';

export const setCookieSession = (app: INestApplication) => {
    app.use(
        session({
            name: process.env.COOKIE_SESSION_NAME || 'session',
            secret: process.env.COOKIE_KEY,
            resave: false,
            saveUninitialized: false,
            ...(process.env.NODE_ENV === 'production'
                ? {
                      cookie: {
                          sameSite: 'none',
                          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // one month
                      },
                  }
                : {}),
        }),
    );
};
