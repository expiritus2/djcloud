import React, { FC } from 'react';
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
    const { tracksGenres, customerState } = useStore();
    const match = useMatch({ path: routes.tracks });
    const location = useLocation();

    const onClickItem = (e: any, tab: string) => {
        if (match?.params.category) {
            customerState.tab = {
                ...customerState.tab,
                [match?.params.category]: tab,
            };
        }
    };

    const menuItems = (tracksGenres.genres[match?.params.category!] || []).map((genre, index) => {
        return {
            path: link.toTracks(match?.params.category!, genre.value),
            label: genre.name,
            value: genre.value,
            count: genre.countTracks,
            active: location.pathname === '/' && index === 0,
            onClickItem,
        } as MenuItem;
    });

    return <Menu listItems={menuItems} className={classNames(styles.mainMenu, className)} />;
};

export default observer(MainMenu);
