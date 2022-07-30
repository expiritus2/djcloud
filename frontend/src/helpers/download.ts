import axios from 'axios';

export const download = (url: string, name: string) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const getUrlExtension = (url: string) => {
    const ext = url?.split(/[#?]/)[0]?.split('.')?.pop()?.trim();
    if (!ext) {
        throw new Error(`Can not extract extension from url: ${url}`);
    }
    return ext;
};

export const downloadByRequest = (fileUrl: string, name: string, cb?: Function) => {
    axios({ url: fileUrl, method: 'GET', responseType: 'blob' }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${name}.${getUrlExtension(fileUrl)}`); //or any other extension
        document.body.appendChild(link);
        link.click();
        cb?.();
    });
};
