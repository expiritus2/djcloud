import { mean, round } from 'lodash';

export const averageRating = (ratings: number[]) => {
  return round(mean(ratings.length ? ratings : [0]));
};
