import axios from 'axios';

export const download = (url: string, name: string) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadByBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    download(url, fileName);
    window.URL.revokeObjectURL(url);
};

export const getUrlExtension = (url: string) => {
    const ext = url?.split(/[#?]/)[0]?.split('.')?.pop()?.trim();
    if (!ext) {
        throw new Error(`Can not extract extension from url: ${url}`);
    }
    return ext;
};

export const downloadByRequest = async (
    fileUrl: string,
    name: string,
    cb?: Function,
    onDownloadProgress?: (progressEvent: any) => void,
) => {
    try {
        const filePath = `${fileUrl}?timestamp=${new Date().getTime()}`;
        const response = await axios.get(filePath, {
            responseType: 'blob',
            onDownloadProgress,
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        download(url, `${name}.${getUrlExtension(fileUrl)}`);
        cb?.();
        return response;
    } catch (err: any) {
        window.open(fileUrl);
        cb?.();
    }
};
