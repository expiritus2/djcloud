import { INestApplication } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

export const setCookieSession = (app: INestApplication) => {
  app.use(cookieSession({ keys: [process.env.COOKIE_KEY] }));
};
