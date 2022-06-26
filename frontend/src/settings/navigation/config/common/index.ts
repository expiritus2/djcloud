import { routes } from 'settings/navigation/routes';
import { Login, Main } from 'pages';
import { INavigation } from 'types/navigation';

const commonRoutes: INavigation[] = [
    {
        path: routes.index,
        Component: Main,
    },
    {
        path: routes.tracks,
        Component: Main,
    },
    {
        path: routes.tracksCategory,
        Component: Main,
    },
    {
        path: routes.login,
        Component: Login,
        roles: [],
    },
];

export default commonRoutes;
