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
        path: routes.track,
        Component: Main,
    },
    {
        path: routes.categoryPage,
        Component: Main,
    },
    {
        path: routes.allTracks,
        Component: Main,
    },
    {
        path: routes.login,
        Component: Login,
        roles: [],
    },
];

export default commonRoutes;
