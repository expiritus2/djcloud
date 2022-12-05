import { apiServer } from 'settings/web-services/api';

import { PaginationParams, RequestOptions } from '../../types/request';

export type ZipStatusResponse = {
    id: number;
    isFinished: boolean;
    pathToFile: string;
    progress: number;
    countFiles: number | null;
};

export const uploadFile = ({ file, title }: { file: File; title: string }, options: RequestOptions) => {
    const formData = new FormData();
    const extension = file.name.split('.').pop();
    formData.append('file', file, `${title}.${extension}`);

    return apiServer.post('/files/file-upload', formData, options);
};

export const createZip = (cfg: PaginationParams & { visible?: boolean }) => {
    return apiServer.get<ZipStatusResponse>('/files/create/zip', { params: cfg });
};

export const removeZip = (cfg: { id: number; url: string }) => {
    return apiServer.post('/files/remove/zip', cfg);
};

export const checkZipStatus = (cfg: { id: number }) => {
    return apiServer.get<ZipStatusResponse>(`/files/check-zip-status/${cfg.id}`);
};
