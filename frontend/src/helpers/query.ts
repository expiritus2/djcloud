import qs from 'query-string';
import { Location } from 'react-router-dom';

export const setQuery = (params: { [key: string]: any }, location: Location) => {
    const search = qs.stringify(params, { skipEmptyString: true });
    return `${location.pathname}${search ? `?${search}` : ''}`;
};

export const getQuery = (location: Location) => {
    return qs.parse(location.search);
};
