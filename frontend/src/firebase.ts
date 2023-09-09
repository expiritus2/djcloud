import { FirebaseApp } from '@firebase/app';
import { DocumentData, Query } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
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
} from 'firebase/firestore';

import { PaginationParams } from './types/request';

export class Firebase {
    app: FirebaseApp;

    initFirebase() {
        // Import the functions you need from the SDKs you need
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: 'AIzaSyCFlymRnMnbXpFBcYpA6d3JaGz5YdBQ2S8',
            authDomain: 'djcloud-dev-8b04b.firebaseapp.com',
            projectId: 'djcloud-dev-8b04b',
            storageBucket: 'djcloud-dev-8b04b.appspot.com',
            messagingSenderId: '629330788037',
            appId: '1:629330788037:web:9a5cf8279d709816e8faac',
        };

        this.app = initializeApp(firebaseConfig);
        console.log('firebase.app', this.app);
    }

    async addDocument(collectionName: string, data: any) {
        return addDoc(collection(getFirestore(), collectionName), data);
    }

    async updateDocument(collectionName: string, id: string, data: any) {
        const washingtonRef = doc(getFirestore(), collectionName, id);

        await updateDoc(washingtonRef, data);
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
        let q: Query;

        if (paginationParams.field && paginationParams.sort) {
            q = query(colRef, orderBy(paginationParams.field, paginationParams.sort));
        } else if (paginationParams.field && paginationParams.sort && paginationParams.limit) {
            q = query(colRef, orderBy(paginationParams.field, paginationParams.sort), limit(paginationParams.limit));
        } else {
            q = query(colRef);
        }

        const docs = await getDocs(q);
        const arr: any = [];
        docs.forEach((d) => arr.push({ id: d.id, ...d.data() }));

        return arr;
    }

    async deleteDocument(collectionName: string, id: string) {
        await deleteDoc(doc(getFirestore(), collectionName, id));
    }
}

export const firebase = new Firebase();
