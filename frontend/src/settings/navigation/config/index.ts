import { INavigation } from 'types/navigation';
import commonRoutes from './common';
import protectedRoutes from './protected';
import { NotFound } from 'pages';

const allRoutes: INavigation[] = [
    ...commonRoutes,
    ...protectedRoutes,
    {
        path: '*',
        Component: NotFound,
        roles: [],
    }
];

export default allRoutes;