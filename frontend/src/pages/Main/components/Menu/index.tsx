import React, { FC, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { Menu } from 'components';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { useMatch, useLocation } from 'react-router-dom';

import { link } from 'settings/navigation/link';
import styles from './styles.module.scss';
import { MenuItem } from 'components/Menu';
import { routes } from 'settings/navigation/routes';
import { TrackGenre } from 'store/TrackGenres/types';
import { GroupedTrackGenres } from 'store/TrackGenres';
import { Category } from 'types/track';

type ComponentProps = {
    className?: string;
};

const MainMenu: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracksGenres, customerState, navCategories } = useStore();
    const match = useMatch({ path: routes.tracks });
    const location = useLocation();

    const onClickItem = useCallback(
        (e: any, tab: string) => {
            if (match?.params.category) {
                customerState.tab = {
                    ...customerState.tab,
                    [match?.params.category]: tab,
                };
            }
        },
        [customerState, match?.params.category],
    );

    const convertMenuItem = useCallback(
        (genre: TrackGenre, index: number, category: Category['value']) => {
            return {
                path: link.toTracks(category, genre.value),
                label: genre.name,
                value: genre.value,
                count: genre.countTracks,
                active: location.pathname === '/' && index === 0,
                onClickItem,
            } as MenuItem;
        },
        [location.pathname, onClickItem],
    );

    const menuItems = useMemo(() => {
        let category = match?.params.category || '';
        if (location.pathname === '/' && navCategories.data?.data) {
            category = navCategories.data?.data?.[0]?.value;
        }
        return ((tracksGenres.data as GroupedTrackGenres)?.[category] || []).map((genre, index) =>
            convertMenuItem(genre, index, category),
        );
    }, [match?.params.category, tracksGenres.data, convertMenuItem, location.pathname, navCategories.data?.data]);

    return <Menu listItems={menuItems} className={classNames(styles.mainMenu, className)} />;
};

export default observer(MainMenu);
