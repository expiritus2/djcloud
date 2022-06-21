import { createContext, useContext } from 'react';
import { configure } from 'mobx';
import { UsersStore } from './admin/User';
import { CategoriesStore } from './admin/Categories';
import { GenresStore } from './admin/Genres';
import { TracksStore } from './admin/Tracks';
import { ModifyCategoryStore } from './admin/ModifyCategory';
import { ModifyGenreStore } from './admin/ModifyGenre';
import { ModifyTrackStore } from './admin/ModifyTrack';
import { InputCategoriesStore } from './InputCategories';

configure({ enforceActions: 'never' });

const store = {
    user: new UsersStore('blue'),
    categories: new CategoriesStore('red'),
    inputCategories: new InputCategoriesStore('#E0AFA0'),
    modifyCategory: new ModifyCategoryStore('#FFB703'),
    modifyGenre: new ModifyGenreStore('#FFCB47'),
    modifyTrack: new ModifyTrackStore('#0B132B'),
    genres: new GenresStore('green'),
    tracks: new TracksStore('purple'),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext<typeof store>(StoreContext);

export default store;
