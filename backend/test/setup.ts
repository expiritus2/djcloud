import { getConnection } from 'typeorm';

global.afterAll(async () => {
  const conn = getConnection();
  await conn.close();
});
