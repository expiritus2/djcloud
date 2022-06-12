import { apiServer } from 'settings/web-services/api';
import { LoginProps } from 'store/admin/User/types';

export const login = (cfg: LoginProps) => {
    return apiServer.post('/auth/signin', cfg);
};

export const currentUser = () => {
    return apiServer.get('/auth/whoami');
};
