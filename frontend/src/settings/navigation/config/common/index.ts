import { routes } from 'settings/navigation/routes';
import { Tracks } from 'pages';
import { INavigation } from 'types/navigation';

const commonRoutes: INavigation[] = [
    {
        path: routes.index,
        Component: Tracks,
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