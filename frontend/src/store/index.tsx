import { createContext, useContext } from 'react';
import { UserStore } from './User';
import { configure } from 'mobx';

configure({ enforceActions: "never" });

const store = {
    user: new UserStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
    return useContext<typeof store>(StoreContext);
}

export default store;