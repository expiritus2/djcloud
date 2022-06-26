import { routes } from '../routes';

export const link = {
    toTracks: (category: string, genre: string) =>
        routes.tracks.replace(/(:category|:genre)/g, (match): string => {
            if (match === ':category') {
                return category;
            }

            if (match === ':genre') {
                return genre;
            }
            return '';
        }),
};
