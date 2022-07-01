import React, { FC } from 'react';
import classNames from 'classnames';
import { Track } from 'types/track';
import { formatDate, getDuration } from 'helpers/formatters';
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';
import { FaDownload } from 'react-icons/fa';
import { sign } from 'settings/sign';

import { useStore } from 'store';

import { observer } from 'mobx-react-lite';
import { downloadByRequest } from 'helpers/download';
import { Rating } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
} & Track;

const TrackComponent: FC<ComponentProps> = (props) => {
    const { className, id, title, duration, createdAt, file } = props;
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

    const onDownload = () => {
        downloadByRequest(file.url, `${sign}-${title}`);
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
                    <FaDownload onClick={onDownload} className={styles.icon} />
                </div>
                <Rating className={styles.rating} />
                <div>{formatDate(createdAt)}</div>
            </div>
        </div>
    );
};

export default observer(TrackComponent);
