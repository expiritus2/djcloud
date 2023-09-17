import { apiServer } from 'settings/web-services/api';

import { FileStorage } from '../../storage';
import { PaginationParams, RequestOptions } from '../../types/request';

export type StoredFilesResponse = {
    fileUrl: string;
    fileName: string;
    title: string;
};

export const uploadFile = async ({ file, title }: { file: File; title: string }, options: RequestOptions) => {
    const fileStorage = new FileStorage();
    const uploadedFile = await fileStorage.upload(file, title);

    // id?: string;
    // mimetype: string;
    // duration: number;
    // name: string;
    // size: number;
    // url?: string;
    // data?: string;

    return { data: { duration: 0, mimetype: file.type, name: title, size: file.size, url: uploadedFile.url } };
    // const formData = new FormData();
    // const extension = file.name.split('.').pop();
    // formData.append('file', file, `${title}.${extension}`);
    //
    // return apiServer.post('/files/file-upload', formData, options);
};

export const getStoredFiles = (cfg: PaginationParams & { visible?: boolean }) => {
    return apiServer.get<StoredFilesResponse[]>('/files/stored/files', { params: cfg });
};
