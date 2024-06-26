import { Categories, Genres, Tracks } from 'pages';
import { routes } from 'settings/navigation/routes';
import { INavigation } from 'types/navigation';
import { UserRoleEnum } from 'types/user';

const protectedRoutes: INavigation[] = [
  {
    path: routes.adminCategoriesList,
    Component: Categories,
    roles: [UserRoleEnum.ADMIN],
  },
  {
    path: routes.adminGenresList,
    Component: Genres,
    roles: [UserRoleEnum.ADMIN],
  },
  {
    path: routes.adminTracksList,
    Component: Tracks,
    roles: [UserRoleEnum.ADMIN],
  },
];

export default protectedRoutes;
