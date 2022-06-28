import React, { FC } from 'react';
import classNames from 'classnames';
import { Track } from 'types/track';
import { formatDate, getDuration } from 'helpers/formatters';
import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai';
import { FaDownload } from 'react-icons/fa';

import { useStore } from 'store';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

type ComponentProps = {
    className?: string;
} & Track;

const TrackComponent: FC<ComponentProps> = (props) => {
    const { className, id, title, duration, createdAt } = props;
    const { currentTrackStore } = useStore();

    const onPlay = () => {
        currentTrackStore.getTrackById({ id });
    };

    const onPause = () => {
        currentTrackStore.resetStore();
    };

    return (
        <div className={classNames(styles.track, className)}>
            <div className={styles.head}>
                <div>
                    {currentTrackStore.store.data?.id == id ? (
                        <AiFillPauseCircle onClick={onPause} className={styles.headIcon} />
                    ) : (
                        <AiFillPlayCircle onClick={onPlay} className={styles.headIcon} />
                    )}
                </div>
                <div className={styles.info}>
                    <div className={styles.author}>DjCloud</div>
                    <div className={styles.trackName}>{title}</div>
                </div>
            </div>
            <div className={styles.meta}>
                <div>{getDuration(duration)}</div>
                <div className={styles.download}>
                    <FaDownload className={styles.icon} />
                </div>
                <div>{formatDate(createdAt)}</div>
            </div>
        </div>
    );
};

export default observer(TrackComponent);
