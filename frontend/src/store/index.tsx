import { createContext, useContext } from 'react';
import { configure } from 'mobx';
import { UsersStore } from './admin/User';
import { CategoriesStore } from './admin/Categories';
import { GenresStore } from './admin/Genres';
import { TracksStore } from './admin/Tracks';

configure({ enforceActions: 'never' });

const store = {
    user: new UsersStore('blue'),
    categories: new CategoriesStore('red'),
    genres: new GenresStore('green'),
    tracks: new TracksStore('purple'),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext<typeof store>(StoreContext);

export default store;
