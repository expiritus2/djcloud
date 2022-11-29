import { apiServer } from 'settings/web-services/api';

import { RequestOptions } from '../../types/request';

export type ZipStatusResponse = {
    id: number;
    isFinished: boolean;
    pathToFile: string;
};

export const uploadFile = ({ file, title }: { file: File; title: string }, options: RequestOptions) => {
    const formData = new FormData();
    const extension = file.name.split('.').pop();
    formData.append('file', file, `${title}.${extension}`);

    return apiServer.post('/files/file-upload', formData, options);
};

export const createZip = (cfg: { visible: boolean }) => {
    return apiServer.post<ZipStatusResponse>('/files/create-zip', cfg);
};

export const removeZip = (cfg: { id: number; url: string }) => {
    return apiServer.post('/files/remove-zip', cfg);
};

export const checkZipStatus = (cfg: { id: number }) => {
    return apiServer.get<ZipStatusResponse>(`/files/check-zip-status/${cfg.id}`);
};
