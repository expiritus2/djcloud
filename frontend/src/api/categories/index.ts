import { CreateCategoryDto, GetCategoryDto, RemoveCategoryDto, UpdateCategoryDto } from 'store/ModifyCategory/types';
import { PaginationParams } from 'types/request';

import { firestore } from '../../firestore';

const COLLECTION_NAME = 'categories';

export class Categories {
    static async getAll(cfg: PaginationParams) {
        const docs = await firestore.getDocuments(COLLECTION_NAME, cfg);
        return { data: { data: docs } };
    }

    static async create(cfg: CreateCategoryDto): Promise<string> {
        const result = await firestore.addDocument(COLLECTION_NAME, { name: cfg.name, value: cfg.name.toLowerCase() });
        return result.id;
    }

    static async update(cfg: UpdateCategoryDto) {
        const { id, ...config } = cfg;
        await firestore.updateDocument(COLLECTION_NAME, id, config);
        return Categories.getById({ id });
    }

    static async remove({ id }: RemoveCategoryDto) {
        await firestore.deleteDocument(COLLECTION_NAME, id);
        return { data: { data: 'Success' } };
    }

    static async getById({ id }: GetCategoryDto) {
        const category = await firestore.getDocument(COLLECTION_NAME, id);
        return { data: category };
    }
}
