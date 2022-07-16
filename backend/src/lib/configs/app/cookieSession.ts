import { INestApplication } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

export const setCookieSession = (app: INestApplication) => {
    app.use(
        cookieSession({
            name: process.env.COOKIE_SESSION_NAME || 'session',
            keys: [process.env.COOKIE_KEY],
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // one month
            sameSite: false,
        }),
    );
};
