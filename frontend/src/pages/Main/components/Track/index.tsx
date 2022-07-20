import React, { FC } from 'react';
import classNames from 'classnames';
import { Track } from 'types/track';
import { formatDate, getDuration } from 'helpers/formatters';
import { sign } from 'settings/sign';

import { observer } from 'mobx-react-lite';
import { Rating, Play, DownloadTrack } from 'components';
import { useScreen } from 'hooks';

import styles from './styles.module.scss';
import { MOBILE } from '../../../../settings/constants/screen';

type ComponentProps = {
    className?: string;
} & Track;

const TrackComponent: FC<ComponentProps> = (props) => {
    const { className, id, title, duration, file, createdAt, rating, countRatings, isDidRating } = props;
    const { screen } = useScreen();

    return (
        <div className={classNames(styles.track, className)}>
            <div className={styles.head}>
                <Play trackId={id} />
                <div className={styles.info}>
                    <div className={styles.author}>{sign}</div>
                    <div className={styles.trackName}>{title}</div>
                </div>
            </div>
            <div className={styles.meta}>
                <div>{getDuration(duration)}</div>
                <DownloadTrack url={file.url!} title={title} />
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
