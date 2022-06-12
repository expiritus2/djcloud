import { routes } from 'settings/navigation/routes';
import { Login, Main } from 'pages';
import { INavigation } from 'types/navigation';

const commonRoutes: INavigation[] = [
    {
        path: routes.index,
        Component: Main,
    },
    {
        path: routes.mixs,
        Component: Main,
    },
    {
        path: routes.created,
        Component: Main,
    },
    {
        path: routes.login,
        Component: Login,
        roles: [],
    },
];

export default commonRoutes;
