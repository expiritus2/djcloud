import { routes } from '../routes';

export const link = {
    toTracks: (category: string, genre: string | undefined) =>
        routes.tracks.replace(/(:category|:genre)/g, (match): string => {
            if (match === ':category' && category) {
                return category;
            }

            if (match === ':genre' && genre) {
                return genre;
            }
            return '';
        }),
    toAdminPage: (tab: string | null) => {
        if (tab === 'tracks') {
            return routes.adminTracksList;
        }

        if (tab === 'genres') {
            return routes.adminGenresList;
        }
        return routes.adminCategoriesList;
    },
};
