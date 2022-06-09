// import { apiServer } from '../../settings/web-services/api';
import { LoginProps } from '../../store/User/types';

export const login = (cfg: LoginProps) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    id: 1,
                    name: 'Some user name'
                },
                meta: cfg
            });
        }, 1000);
    })
    // return apiServer.post('/auth/signin', cfg)
}