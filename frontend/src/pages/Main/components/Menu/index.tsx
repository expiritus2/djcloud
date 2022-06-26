import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Menu } from 'components';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { useMatch } from 'react-router-dom';

import { link } from 'settings/navigation/link';
import styles from './styles.module.scss';
import { MenuItem } from 'components/Menu';
import { routes } from 'settings/navigation/routes';

type ComponentProps = {
    className?: string;
};

type TrackGenre = {
    id: number;
    name: string;
    value: string;
    countTracks: number;
};

const MainMenu: FC<ComponentProps> = (props) => {
    const { className } = props;
    const [genres, setGenres] = useState([] as TrackGenre[]);
    const { tracks } = useStore();
    const match = useMatch({ path: routes.tracks });
    const altMatch = useMatch({ path: routes.tracksCategory });

    useEffect(() => {
        tracks.getTracksGenres(
            { category: match?.params.category! || altMatch?.params.category! },
            {},
            (err: any, response: any) => {
                if (!err) {
                    setGenres(response.data);
                }
            },
        );
    }, [match?.params.category, altMatch?.params.category]); // eslint-disable-line

    const menuItems = genres
        .map((genre) => {
            return {
                path: link.toTracks(match?.params.category! || altMatch?.params.category!, genre.value),
                label: genre.name,
                count: genre.countTracks,
            } as MenuItem;
        })
        .sort((a, b) => a.label.localeCompare(b.label));

    return <Menu listItems={menuItems} className={classNames(styles.mainMenu, className)} />;
};

export default observer(MainMenu);
