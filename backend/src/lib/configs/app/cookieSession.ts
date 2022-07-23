import { INestApplication } from '@nestjs/common';
import session from 'express-session';
import { EnvEnums } from '../envs';

export const setCookieSession = (app: INestApplication) => {
    app.use(
        session({
            name: process.env.COOKIE_SESSION_NAME || 'session',
            secret: process.env.COOKIE_KEY,
            resave: false,
            saveUninitialized: false,
            proxy: true,
            ...(process.env.ENVIRONMENT === EnvEnums.PRODUCTION
                ? {
                      cookie: {
                          secure: true,
                          sameSite: 'none',
                          maxAge: 1000 * 60 * 60 * 24 * 30, // one month
                      },
                  }
                : {
                      cookie: {
                          maxAge: 1000 * 60 * 60 * 24 * 30, // one month
                      },
                  }),
        }),
    );
};
