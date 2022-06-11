import { createContext, useContext } from 'react';
import { configure } from 'mobx';
import { UserStore } from './User';

configure({ enforceActions: 'never' });

const store = {
    user: new UserStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext<typeof store>(StoreContext);

export default store;
