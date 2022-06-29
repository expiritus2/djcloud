import axios from 'axios';

const getDevelopmentApiLink = () => process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000/api';
const getProductionApiLink = () => process.env.REACT_APP_API_ENDPOINT;

export const apiServer = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? getProductionApiLink() : getDevelopmentApiLink(),
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
