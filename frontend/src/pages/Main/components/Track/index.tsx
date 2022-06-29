import React, { FC } from 'react';
import classNames from 'classnames';
import { Track } from 'types/track';
import { formatDate, getDuration } from 'helpers/formatters';
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';
import { FaDownload } from 'react-icons/fa';
import { sign } from 'settings/sign';

import { useStore } from 'store';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

type ComponentProps = {
    className?: string;
} & Track;

const TrackComponent: FC<ComponentProps> = (props) => {
    const { className, id, title, duration, createdAt } = props;
    const { currentTrack } = useStore();

    const onPlay = () => {
        currentTrack.getTrackById({ id });
    };

    const onPause = () => {
        if (!currentTrack.pause) {
            currentTrack.setPause();
        }
    };

    const getHeadIcon = () => {
        return !currentTrack.pause && currentTrack.data?.id == id ? (
            <AiFillPauseCircle onClick={onPause} className={styles.headIcon} />
        ) : (
            <AiFillPlayCircle onClick={onPlay} className={styles.headIcon} />
        );
    };

    return (
        <div className={classNames(styles.track, className)}>
            <div className={styles.head}>
                {getHeadIcon()}
                <div className={styles.info}>
                    <div className={styles.author}>{sign}</div>
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
