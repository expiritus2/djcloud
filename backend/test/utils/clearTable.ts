import path from 'path';
import fs from 'fs';
import { getConnection } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { GenreEntity } from '../../src/modules/genres/genre.entity';
import { CategoryEntity } from '../../src/modules/categories/category.entity';

export const clearTable = async <E>(Entity: EntityTarget<E>) => {
  const connection = getConnection();
  await connection.getRepository<E>(Entity).delete({});
};

export const clearTestUploads = async () => {
  const directory = path.resolve('upload', 'test');
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

export const createGenres = async () => {
  const connection = getConnection();
  const genreRepo = await connection.getRepository(GenreEntity);

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
  const connection = getConnection();
  const categoryRepo = await connection.getRepository(CategoryEntity);

  const categories = [
    { name: 'Mixs', value: 'mixs' },
    { name: 'Creates', value: 'drum_n_base' },
  ];

  for (const category of categories) {
    const newCategory = categoryRepo.create(category);
    await categoryRepo.save(newCategory);
  }
};
