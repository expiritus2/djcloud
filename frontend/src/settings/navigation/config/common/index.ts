import { routes } from 'settings/navigation/routes';
import { Login, Tracks } from 'pages';
import { INavigation } from 'types/navigation';

const commonRoutes: INavigation[] = [
    {
        path: routes.index,
        Component: Tracks,
    },
    {
        path: routes.login,
        Component: Login,
        roles: [],
    },
    {
        path: routes.mixs,
        Component: Tracks,
    },
    {
        path: routes.created,
        Component: Tracks,
    },
];

export default commonRoutes;