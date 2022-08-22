import React, { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Track } from 'types/track';
import { formatDate, getDuration } from 'helpers/formatters';
import { sign } from 'settings/sign';

import { observer } from 'mobx-react-lite';
import { Rating, Play, DownloadTrack } from 'components';
import { useScreen } from 'hooks';
import { MOBILE } from 'settings/constants/screen';
import { useStore } from 'store';
import { setUnit } from 'helpers/utils';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
} & Track;

const TrackComponent: FC<ComponentProps> = (props) => {
    const { className, id, title, duration, file, createdAt, rating, countRatings, isDidRating } = props;
    const { screen } = useScreen();
    const { currentTrack } = useStore();
    const trackNameRef = useRef<HTMLDivElement>(null);
    const playRef = useRef<HTMLDivElement>(null);
    const metaRef = useRef<HTMLDivElement>(null);
    const playerItemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (playRef.current && metaRef.current && playerItemRef.current && trackNameRef.current) {
            const playerItemWidth = playerItemRef.current.offsetWidth;
            const playWidth = playRef.current.offsetWidth;
            const metaWidth = metaRef.current.offsetWidth;
            trackNameRef.current.style.width = setUnit(playerItemWidth - playWidth - metaWidth - 50);
        }
    }, [screen.width, screen.height, playRef, metaRef, trackNameRef]);

    return (
        <div
            ref={playerItemRef}
            className={classNames(
                styles.track,
                !currentTrack.pause && currentTrack.data?.id === id ? styles.active : '',
                className,
            )}
        >
            <div className={styles.head}>
                {/* @ts-ignore */}
                <Play ref={playRef} trackId={id} />
                <div className={styles.info}>
                    <div className={styles.author}>{sign}</div>
                    <div ref={trackNameRef} className={styles.trackName}>
                        {title}
                    </div>
                </div>
            </div>
            <div ref={metaRef} className={styles.meta}>
                <div>{getDuration(duration)}</div>
                <DownloadTrack url={file.url!} title={title} />
                <Rating
                    className={styles.rating}
                    trackId={id}
                    rating={rating}
                    countRatings={countRatings}
                    isDidRating={isDidRating}
                />
                {screen.width > MOBILE && <div className={styles.date}>{formatDate(createdAt)}</div>}
            </div>
        </div>
    );
};

export default observer(TrackComponent);
