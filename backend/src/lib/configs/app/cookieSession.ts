import { INestApplication } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
import helmet from 'helmet';

export const setCookieSession = (app: INestApplication) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.set('trust proxy', 1);
    app.use(helmet());
    app.use(
        cookieSession({
            name: process.env.COOKIE_SESSION_NAME || 'session',
            keys: [process.env.COOKIE_KEY],
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // one month
            sameSite: false,
        }),
    );
};
