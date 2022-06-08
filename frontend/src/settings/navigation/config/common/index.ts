import { routes } from 'settings/navigation/routes';
import { Main, Login } from 'pages';
import { INavigation } from 'types/navigation';

const commonRoutes: INavigation[] = [
    {
        path: routes.index,
        Component: Main,
        roles: [],
    },
    {
        path: routes.login,
        Component: Login,
        roles: [],
    },
];

export default commonRoutes;