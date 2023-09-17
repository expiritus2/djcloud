import { DocumentData } from '@firebase/firestore';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';

import { PaginationParams } from './types/request';

export class Firestore {
    async addDocument(collectionName: string, data: any) {
        return addDoc(collection(getFirestore(), collectionName), { ...data, createdAt: Date.now() });
    }

    async updateDocument(collectionName: string, id: string, data: any) {
        const washingtonRef = doc(getFirestore(), collectionName, id);

        return updateDoc(washingtonRef, data);
    }

    async getDocument(collectionName: string, ...pathSegments: string[]): Promise<DocumentData | undefined> {
        const docRef = doc(getFirestore(), collectionName, ...pathSegments);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log('No such document!');
        }
    }

    async getDocuments(collectionName: string, paginationParams: PaginationParams) {
        const colRef = collection(getFirestore(), collectionName);

        const conditions = [];

        if (paginationParams.search) {
            conditions.push(where('name', '==', paginationParams.search));
        }

        if (paginationParams.filters?.length) {
            paginationParams.filters.map((filter) => {
                conditions.push(where(filter.name, filter.operator, filter.value));
            });
        }

        if (paginationParams.field && paginationParams.sort) {
            conditions.push(orderBy(paginationParams.field, paginationParams.sort));
        }

        if (paginationParams.limit) {
            conditions.push(limit(paginationParams.limit));
        }

        const q = query(colRef, ...conditions);

        const docs = await getDocs(q);
        const arr: any = [];
        docs.forEach((d) => arr.push({ id: d.id, ...d.data() }));

        return arr;
    }

    async deleteDocument(collectionName: string, id: string) {
        await deleteDoc(doc(getFirestore(), collectionName, id));
    }
}

export const firestore = new Firestore();
