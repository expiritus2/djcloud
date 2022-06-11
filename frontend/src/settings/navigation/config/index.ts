import { INavigation } from 'types/navigation';
import { NotFound } from 'pages';
import commonRoutes from './common';
import protectedRoutes from './protected';

const allRoutes: INavigation[] = [
    ...commonRoutes,
    ...protectedRoutes,
    {
        path: '*',
        Component: NotFound,
        roles: [],
    },
];

export default allRoutes;
