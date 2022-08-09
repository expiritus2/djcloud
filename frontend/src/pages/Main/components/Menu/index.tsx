import React, { FC, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { Menu, MenuSwitcher } from 'components';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { useMatch, useLocation } from 'react-router-dom';

import { link } from 'settings/navigation/link';
import { MenuItem } from 'components/Menu';
import { routes } from 'settings/navigation/routes';
import { TrackGenre } from 'store/TrackGenres/types';
import { GroupedTrackGenres } from 'store/TrackGenres';

import { groupByNameTrackGenres } from '../../helpers';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const MainMenu: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracksGenres, navCategories } = useStore();
    const match = useMatch({ path: routes.tracks });
    const altMatch = useMatch({ path: routes.categoryPage });
    const oneTrackMatch = useMatch({ path: routes.track });
    const location = useLocation();

    const convertMenuItem = useCallback((genre: TrackGenre, index: number, categoryId: string) => {
        return {
            path: link.toTracks(categoryId, genre.id?.toString()),
            label: genre.name,
            value: genre.id?.toString(),
            count: genre.countTracks,
        } as MenuItem;
    }, []);

    const mapTrackGenresByCategory = useCallback(
        ([categoryId, genres]: [string, TrackGenre[]], groupedGenres: { [key: string]: TrackGenre[] }) => {
            return genres
                .map((genre: TrackGenre, index: number) => {
                    const item = convertMenuItem(genre, index, categoryId);
                    const cat = (navCategories.data?.data || []).find((category) => +category.id === +categoryId);

                    if (cat && groupedGenres[genre.name]?.length > 1) {
                        item.label = `${item.label} - ${cat.name}`;
                    }
                    return item;
                })
                .flat(1);
        },
        [convertMenuItem, navCategories.data?.data],
    );

    const menuItems = useMemo(() => {
        let list: MenuItem[] = [];
        if (
            location.pathname === routes.allTracks ||
            (location.pathname === routes.index && navCategories.data?.data)
        ) {
            const groupedGenres = groupByNameTrackGenres(tracksGenres.data);
            list = Object.entries(tracksGenres.data || ({} as GroupedTrackGenres))
                .map((entries) => mapTrackGenresByCategory(entries, groupedGenres))
                .flat(1);
        }

        if (oneTrackMatch?.params.trackId && oneTrackMatch?.params.categoryId) {
            const categoryId = +oneTrackMatch?.params.categoryId;
            if (tracksGenres.data?.[categoryId]) {
                const categoryGenres = {
                    [categoryId]: tracksGenres.data?.[categoryId],
                };
                const groupedGenres = groupByNameTrackGenres(categoryGenres);
                list = Object.entries(categoryGenres || ({} as GroupedTrackGenres))
                    .map((entries) => mapTrackGenresByCategory(entries, groupedGenres))
                    .flat(1);
            }
        }

        if (altMatch?.params.categoryId) {
            const categoryId = +altMatch?.params.categoryId;
            if (tracksGenres.data?.[categoryId]) {
                const categoryGenres = {
                    [categoryId]: tracksGenres.data?.[categoryId],
                };
                const groupedGenres = groupByNameTrackGenres(categoryGenres);
                list = Object.entries(categoryGenres || ({} as GroupedTrackGenres))
                    .map((entries) => mapTrackGenresByCategory(entries, groupedGenres))
                    .flat(1);
            }
        }

        if (match?.params.categoryId) {
            const categoryId = match?.params.categoryId || navCategories.data?.data?.[0]?.id.toString() || '';
            if (categoryId) {
                list = ((tracksGenres.data as GroupedTrackGenres)?.[+categoryId] || []).map((genre, index) =>
                    convertMenuItem(genre, index, categoryId),
                );
            }
        }
        return list.sort((a, b) => a.label.localeCompare(b.label));
    }, [
        oneTrackMatch?.params.categoryId,
        oneTrackMatch?.params.trackId,
        match?.params.categoryId,
        tracksGenres.data,
        convertMenuItem,
        location.pathname,
        navCategories.data?.data,
        mapTrackGenresByCategory,
        altMatch?.params.categoryId,
    ]);

    return (
        <Menu
            listItems={menuItems}
            className={classNames(styles.mainMenu, className)}
            switcher={
                location.pathname !== routes.allTracks && location.pathname !== routes.index ? <MenuSwitcher /> : null
            }
        />
    );
};

export default observer(MainMenu);
