import { routes } from '../routes';

export const link = {
    toTracks: (categoryId: string, genreId: string | undefined) => {
        return routes.tracks.replace(/(:categoryId|:genreId)/g, (match): string => {
            if (match === ':categoryId' && categoryId) {
                return categoryId;
            }

            if (match === ':genreId' && genreId) {
                return genreId;
            }
            return '';
        });
    },
    toAdminPage: (tab: string | null) => {
        if (tab === 'tracks') {
            return routes.adminTracksList;
        }

        if (tab === 'genres') {
            return routes.adminGenresList;
        }
        return routes.adminCategoriesList;
    },

    toAllCategoryTracks: (categoryId: string | undefined) => {
        return routes.categoryPage.replace(/(:categoryId)/g, (match): string => {
            if (match === ':categoryId' && categoryId) {
                return categoryId;
            }
            return '';
        });
    },
};
