import { FirebaseApp } from '@firebase/app';
import { Auth } from '@firebase/auth';
import { Firestore } from '@firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export class Firebase {
    app: FirebaseApp;
    db: Firestore;
    auth: Auth;

    initFirebase() {
        // Import the functions you need from the SDKs you need
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: 'AIzaSyAHYDQ-tVw0d3FcPkeHAmo4j3bQEmVJjUI',
            authDomain: 'djcloud-dev-ab742.firebaseapp.com',
            projectId: 'djcloud-dev-ab742',
            storageBucket: 'djcloud-dev-ab742.appspot.com',
            messagingSenderId: '454635903188',
            appId: '1:454635903188:web:760520afc0536118e20341',
        };

        this.app = initializeApp(firebaseConfig);
        console.log('firebase.app', this.app);
    }

    initDb() {
        if (this.app) {
            this.db = getFirestore(this.app);
        }
    }

    initAuth() {
        if (this.app) {
            this.auth = getAuth(this.app);
        }
    }
}

export const firebase = new Firebase();
