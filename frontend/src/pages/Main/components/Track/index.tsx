import React, { FC } from 'react';
import classNames from 'classnames';
import { Track } from 'types/track';
import { formatDate, getDuration } from 'helpers/formatters';
import { FaDownload } from 'react-icons/fa';
import { sign } from 'settings/sign';

import { observer } from 'mobx-react-lite';
import { downloadByRequest } from 'helpers/download';
import { Rating, Play } from 'components';
import { useScreen } from 'hooks';
import { MOBILE } from 'settings/constants/screen';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
} & Track;

const TrackComponent: FC<ComponentProps> = (props) => {
    const { className, id, title, duration, createdAt, file, rating, countRatings, isDidRating } = props;
    const { screen } = useScreen();
    const { currentTrack } = useStore();

    const onDownload = () => {
        if (file.url) {
            downloadByRequest(file.url, `${sign}-${title}`);
        }
    };

    return (
        <div
            className={classNames(
                styles.track,
                !currentTrack.pause && currentTrack.data?.id === id ? styles.active : '',
                className,
            )}
        >
            <div className={styles.head}>
                <Play trackId={id} />
                <div className={styles.info}>
                    <div className={styles.author}>{sign}</div>
                    <div className={styles.trackName}>{title}</div>
                </div>
            </div>
            <div className={styles.meta}>
                <div>{getDuration(duration)}</div>
                <div className={styles.download}>
                    <FaDownload onClick={onDownload} className={classNames(styles.icon)} />
                </div>
                <Rating
                    className={styles.rating}
                    trackId={id}
                    rating={rating}
                    countRatings={countRatings}
                    isDidRating={isDidRating}
                />
                {screen.width > MOBILE && <div>{formatDate(createdAt)}</div>}
            </div>
        </div>
    );
};

export default observer(TrackComponent);
