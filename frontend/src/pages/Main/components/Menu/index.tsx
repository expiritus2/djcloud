import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Menu } from 'components';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { useMatch, useLocation } from 'react-router-dom';

import { link } from 'settings/navigation/link';
import styles from './styles.module.scss';
import { MenuItem } from 'components/Menu';
import { routes } from 'settings/navigation/routes';

type ComponentProps = {
    className?: string;
};

const MainMenu: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracksGenres } = useStore();
    const match = useMatch({ path: routes.tracks });
    const altMatch = useMatch({ path: routes.tracksCategory });
    const location = useLocation();

    useEffect(() => {
        let category = match?.params.category! || altMatch?.params.category!;
        tracksGenres.getTracksGenres({ category });
    }, [match?.params.category, altMatch?.params.category]); // eslint-disable-line

    const menuItems = (tracksGenres.store.data || []).map((genre, index) => {
        return {
            path: link.toTracks(match?.params.category! || altMatch?.params.category!, genre.value),
            label: genre.name,
            count: genre.countTracks,
            active: location.pathname === '/' && index === 0,
        } as MenuItem;
    });

    return <Menu listItems={menuItems} className={classNames(styles.mainMenu, className)} />;
};

export default observer(MainMenu);
