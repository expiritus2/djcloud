import { Location } from 'react-router-dom';
import qs from 'query-string';

export const setQuery = (params: { [key: string]: any }, location: Location) => {
  const search = qs.stringify(params, { skipEmptyString: true });
  return `${location.pathname}${search ? `?${search}` : ''}`;
};

export const getQuery = (location: Location) => {
  return qs.parse(location.search);
};
