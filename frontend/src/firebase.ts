import { FirebaseApp } from '@firebase/app';
import { initializeApp } from 'firebase/app';

export class Firebase {
    app: FirebaseApp;

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
    }
}

export const firebase = new Firebase();
