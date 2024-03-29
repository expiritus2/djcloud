import { PathMatch } from 'react-router-dom';
import { groupBy } from 'lodash';
import { NavCategoriesStore } from 'store/NavCategories';
import { GroupedTrackGenres } from 'store/TrackGenres';

import { TrackGenre } from '../../../store/TrackGenres/types';

export const groupByNameTrackGenres = (
  tracksGenres: GroupedTrackGenres | null
): { [key: string]: TrackGenre[] } => {
  return groupBy(
    Object.values(tracksGenres || {})
      .map((g) => g)
      .flat(1),
    'name'
  );
};

export const getCategoryIdFromParams = (
  match: PathMatch | null,
  altMatch: PathMatch | null,
  navCategories: NavCategoriesStore
) => {
  return (
    match?.params.categoryId || altMatch?.params.categoryId || navCategories.data?.data?.[0]?.id
  );
};
