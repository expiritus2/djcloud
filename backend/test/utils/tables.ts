import { EntityTarget } from 'typeorm/common/EntityTarget';

import dataSource from '../../ormconfig';
import { CategoryEntity } from '../../src/categories/category.entity';
import { GenreEntity } from '../../src/genres/genre.entity';

export const clearTable = async <E>(Entity: EntityTarget<E>) => {
  await dataSource.getRepository<E>(Entity).delete({});
};

export const createGenres = async () => {
  const genreRepo = await dataSource.getRepository(GenreEntity);

  const genres = [
    { name: 'Hip-Hop', value: 'hip_hop' },
    { name: "Drum'n'Base", value: 'drum_n_base' },
  ];

  for (const genre of genres) {
    const newGenre = genreRepo.create(genre);
    await genreRepo.save(newGenre);
  }
};

export const createCategories = async () => {
  const categoryRepo = await dataSource.getRepository(CategoryEntity);

  const categories = [
    { name: 'Mixs', value: 'mixs' },
    { name: 'Creates', value: 'drum_n_base' },
  ];

  for (const category of categories) {
    const newCategory = categoryRepo.create(category);
    await categoryRepo.save(newCategory);
  }
};
