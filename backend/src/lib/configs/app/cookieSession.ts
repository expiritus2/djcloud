import { INestApplication } from '@nestjs/common';
import session from 'express-session';

export const setCookieSession = (app: INestApplication) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // app.set('trust proxy', 1);
    app.use(
        session({
            name: process.env.COOKIE_SESSION_NAME || 'session',
            secret: process.env.COOKIE_KEY,
            resave: false,
            saveUninitialized: false,
            ...(process.env.NODE_ENV === 'production'
                ? {
                      cookie: {
                          secure: false,
                          sameSite: 'none',
                          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // one month
                      },
                  }
                : {}),
        }),
    );
};
