import { apiServer } from 'settings/web-services/api';

import { PaginationParams, RequestOptions } from '../../types/request';

export type StoredFilesResponse = {
  fileUrl: string;
  fileName: string;
  title: string;
};

export const uploadFile = (
  { file, title }: { file: File; title: string },
  options: RequestOptions
) => {
  const formData = new FormData();
  const extension = file.name.split('.').pop();
  formData.append('file', file, `${title}.${extension}`);

  return apiServer.post('/files/file-upload', formData, options);
};

export const getStoredFiles = (cfg: PaginationParams & { visible?: boolean }) => {
  return apiServer.get<StoredFilesResponse[]>('/files/stored/files', { params: cfg });
};
