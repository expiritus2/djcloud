import React, { FC, useEffect } from 'react';
import classNames from 'classnames';

import { useMatch } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { Track as TrackComponent } from '..';

import { Track } from 'types/track';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Content: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const match = useMatch({ path: routes.tracks });
    const altMatch = useMatch({ path: routes.tracksCategory });
    const category = match?.params.category || altMatch?.params.category;
    const genre = match?.params.genre || altMatch?.params.genre;

    useEffect(() => {
        tracks.resetStore();
        if (category && genre) {
            tracks.getAll({ category, genre, visible: true });
        }
    }, [category, genre, tracks]);

    return (
        <div className={classNames(styles.content, className)}>
            {tracks.data?.data.map((track: Track) => (
                <TrackComponent key={track.id} {...track} className={styles.track} />
            ))}
        </div>
    );
};

export default observer(Content);
