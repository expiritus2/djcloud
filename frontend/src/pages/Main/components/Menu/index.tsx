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
// import Switcher from './Switcher';
import { TrackGenresViewEnum } from 'types/track';
import { GroupedTrackGenres, NestedTrackGenres } from 'store/TrackGenres';

type ComponentProps = {
    className?: string;
};

const MainMenu: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracksGenres, customerState } = useStore();
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

    // const onSwitchView = (e: any, view: TrackGenresViewEnum) => {
    //     tracksGenres.getTracksGenres({ view });
    // };

    const convertMenuItem = useCallback(
        (genre: TrackGenre, index: number) => {
            return {
                path: link.toTracks(match?.params.category!, genre.value),
                label: genre.name,
                value: genre.value,
                count: genre.countTracks,
                active: location.pathname === '/' && index === 0,
                onClickItem,
            } as MenuItem;
        },
        [location.pathname, match?.params.category, onClickItem],
    );

    const menuItems = useMemo(() => {
        if (tracksGenres.meta.view === TrackGenresViewEnum.DATE) {
            return Object.entries((tracksGenres.data as NestedTrackGenres)?.[match?.params.category!]).reduce(
                (acc, [key, value]) => ({ ...acc, [key]: value.map(convertMenuItem) }),
                {},
            );
        }
        return ((tracksGenres.data as GroupedTrackGenres)?.[match?.params.category!] || []).map(convertMenuItem);
    }, [match?.params.category, tracksGenres.data, tracksGenres.meta.view, convertMenuItem]);

    return (
        <Menu
            listItems={menuItems}
            className={classNames(styles.mainMenu, className)}
            // switcher={<Switcher onClick={onSwitchView} active={tracksGenres.meta.view} />}
        />
    );
};

export default observer(MainMenu);
