import React, { FC } from 'react';
import classNames from 'classnames';

import { Track } from 'types/track';
import { Track as TrackComponent } from '..';
import { useStore } from 'store';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const BaseComponent: FC<ComponentProps> = (props) => {
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

export default BaseComponent;
