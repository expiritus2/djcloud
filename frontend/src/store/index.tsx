import { createContext, useContext } from 'react';
import { configure } from 'mobx';
import { UsersStore } from './User';
import { CategoriesStore } from './Categories';
import { GenresStore } from './Genres';
import { TracksStore } from './Tracks';
import { ModifyCategoryStore } from './ModifyCategory';
import { ModifyGenreStore } from './ModifyGenre';
import { ModifyTrackStore } from './ModifyTrack';

configure({ enforceActions: 'never' });

const store = {
    user: new UsersStore('blue'),
    categories: new CategoriesStore('red'),
    modifyCategory: new ModifyCategoryStore('#FFB703'),
    modifyGenre: new ModifyGenreStore('#FFCB47'),
    modifyTrack: new ModifyTrackStore('#0B132B'),
    genres: new GenresStore('green'),
    tracks: new TracksStore('purple'),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext<typeof store>(StoreContext);

export default store;
