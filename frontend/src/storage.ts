import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes, UploadResult } from 'firebase/storage';
import { v4 as uuid } from 'uuid';

export class FileStorage {
    storage: FirebaseStorage;

    constructor() {
        this.storage = getStorage(undefined, 'gs://djcloud-dev-ab742.appspot.com');
    }

    async upload(file: File, title: string): Promise<UploadResult & { url: string }> {
        return new Promise((resolve) => {
            const storageRef = ref(this.storage, `${uuid()}/${title}`);
            uploadBytes(storageRef, file).then(async (snapshot) => {
                const url = await getDownloadURL(storageRef);
                resolve({ ...snapshot, url });
            });
        });
    }
}
