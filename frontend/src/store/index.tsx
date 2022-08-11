import { createContext, useContext } from 'react';
import { configure } from 'mobx';
import { UsersStore } from './User';
import { CategoriesStore } from './Categories';
import { GenresStore } from './Genres';
import { TracksStore } from './Tracks';
import { ModifyCategoryStore } from './ModifyCategory';
import { ModifyGenreStore } from './ModifyGenre';
import { ModifyTrackStore } from './ModifyTrack';
import { TracksGenresStore } from './TrackGenres';
import { CurrentTrackStore } from './CurrentTrack';
import { AdminState } from './AdminState';
import { TrackRatingStore } from './TrackRating';
import { NavCategoriesStore } from './NavCategories';
import { Stats } from './Stats';

configure({ enforceActions: 'never' });

const store = {
    user: new UsersStore(),
    categories: new CategoriesStore(),
    navCategories: new NavCategoriesStore(),
    modifyCategory: new ModifyCategoryStore(),
    modifyGenre: new ModifyGenreStore(),
    modifyTrack: new ModifyTrackStore(),
    genres: new GenresStore(),
    tracks: new TracksStore(),
    tracksGenres: new TracksGenresStore(),
    currentTrack: new CurrentTrackStore(),
    adminState: new AdminState(),
    trackRating: new TrackRatingStore(),
    stats: new Stats(),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext<typeof store>(StoreContext);

export default store;
