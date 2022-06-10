import { INavigation } from 'types/navigation';
import { routes } from 'settings/navigation/routes';
import { Categories } from 'pages';
import { UserRoleEnum } from 'types/user';

const protectedRoutes: INavigation[] = [
    {
        path: routes.adminCategoriesList,
        Component: Categories,
        roles: [UserRoleEnum.ADMIN],
    },
];

export default protectedRoutes;