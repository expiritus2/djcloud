import { groupBy } from 'lodash';
import { GroupedTrackGenres, TracksGenresStore } from 'store/TrackGenres';
import { NavCategoriesStore } from 'store/NavCategories';
import { PathMatch } from 'react-router/lib/router';

export const groupTrackGenres = (tracksGenres: GroupedTrackGenres | null) => {
    return groupBy(
        Object.values(tracksGenres || {})
            .map((g) => g)
            .flat(1),
        'name',
    );
};

export const getCategoryIdFromParams = (
    match: PathMatch | null,
    altMatch: PathMatch | null,
    navCategories: NavCategoriesStore,
) => {
    return match?.params.categoryId || altMatch?.params.categoryId || navCategories.data?.data?.[0]?.id;
};

export const getGenreIdFromParams = (
    match: PathMatch | null,
    tracksGenres: TracksGenresStore,
    categoryId: string | number,
) => {
    return match?.params.genreId || (tracksGenres.data as GroupedTrackGenres)?.[+categoryId]?.[0].id;
};
