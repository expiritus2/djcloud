import React, { FC } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { Track } from 'types/track';

import { Track as TrackComponent } from '..';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Tracks: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();

    return (
        <div className={classNames(styles.tracks, className)}>
            {tracks.data?.data.map((track: Track) => (
                <TrackComponent key={track.id} {...track} className={styles.track} />
            ))}
        </div>
    );
};

export default observer(Tracks);
