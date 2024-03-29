import dataSource from '../ormconfig';

global.afterAll(async () => {
  await dataSource.destroy();
});
