import { CreateGenreDto, GetGenreDto, RemoveGenreDto, UpdateGenreDto } from 'store/ModifyGenre/types';
import { PaginationParams } from 'types/request';

import { firestore } from '../../firestore';

const COLLECTION_NAME = 'genres';

export class Genres {
    static async getAll(cfg: PaginationParams) {
        const docs = await firestore.getDocuments(COLLECTION_NAME, cfg);
        return { data: { data: docs } };
    }

    static async create(cfg: CreateGenreDto) {
        const result = await firestore.addDocument(COLLECTION_NAME, { name: cfg.name, value: cfg.name.toLowerCase() });
        return result.id;
    }

    static async update(cfg: UpdateGenreDto) {
        const { id, ...config } = cfg;
        await firestore.updateDocument(COLLECTION_NAME, id, config);
        return Genres.getById({ id });
    }

    static async remove({ id }: RemoveGenreDto) {
        await firestore.deleteDocument(COLLECTION_NAME, id);
        return { data: { data: 'Success' } };
    }

    static async getById({ id }: GetGenreDto) {
        const category = await firestore.getDocument(COLLECTION_NAME, id);
        return { data: category };
    }
}
