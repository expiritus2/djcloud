import { apiServer } from 'settings/web-services/api';

import { RequestOptions } from '../../types/request';

export const uploadFile = ({ file, title }: { file: File; title: string }, options: RequestOptions) => {
    const formData = new FormData();
    const extension = file.name.split('.').pop();
    formData.append('file', file, `${title}.${extension}`);

    return apiServer.post('/files/file-upload', formData, options);
};
