import { apiServer } from 'settings/web-services/api';

export const uploadFile = ({ file, title }: { file: File; title: string }) => {
    const formData = new FormData();
    const extension = file.name.split('.').pop();
    formData.append('file', file, `${title}.${extension}`);

    return apiServer.post('/files/file-upload', formData);
};
