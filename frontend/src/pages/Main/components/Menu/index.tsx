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
import { groupBy } from 'lodash';

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
            if (match?.params.categoryId) {
                customerState.tab = {
                    ...customerState.tab,
                    [match?.params.categoryId]: tab,
                };
            }
        },
        [customerState, match?.params.categoryId],
    );

    const convertMenuItem = useCallback(
        (genre: TrackGenre, index: number, categoryId: string) => {
            return {
                path: link.toTracks(categoryId, genre.id?.toString()),
                label: genre.name,
                value: genre.id?.toString(),
                count: genre.countTracks,
                active: location.pathname === '/' && index === 0,
                onClickItem,
            } as MenuItem;
        },
        [location.pathname, onClickItem],
    );

    const menuItems = useMemo(() => {
        if (location.pathname === routes.allTracks) {
            const groupedGenres = groupBy(
                Object.values(tracksGenres.data || ({} as GroupedTrackGenres))
                    .map((g) => g)
                    .flat(1),
                'name',
            );

            return Object.entries(tracksGenres.data || ({} as GroupedTrackGenres))
                .map(([categoryId, genres]) => {
                    return genres.map((genre: TrackGenre, index: number) => {
                        const item = convertMenuItem(genre, index, categoryId);
                        const cat = (navCategories.data?.data || []).find((category) => +category.id === +categoryId);

                        if (cat && groupedGenres[genre.name]?.length > 1) {
                            item.label = `${item.label} - ${cat.name}`;
                        }
                        return item;
                    });
                })
                .flat(1);
        }

        let categoryId = match?.params.categoryId || '';
        if (location.pathname === '/' && navCategories.data?.data) {
            categoryId = navCategories.data?.data?.[0]?.id.toString();
        }
        return ((tracksGenres.data as GroupedTrackGenres)?.[+categoryId] || []).map((genre, index) =>
            convertMenuItem(genre, index, categoryId),
        );
    }, [match?.params.categoryId, tracksGenres.data, convertMenuItem, location.pathname, navCategories.data?.data]);

    return <Menu listItems={menuItems} className={classNames(styles.mainMenu, className)} />;
};

export default observer(MainMenu);
