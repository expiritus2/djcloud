import React, { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AudioPlayer from 'react-h5-audio-player';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { usePrevious, useScreen } from 'hooks';
import { observer } from 'mobx-react-lite';
import { sign } from 'settings/sign';
import { useStore } from 'store';

import { Rating } from 'components';

import 'react-h5-audio-player/src/styles.scss';
import './styles.scss';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const listenInterval = 1000;
let statSent = false;

const Player: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { currentTrack, stats } = useStore();
    const player = useRef();
    const location = useLocation();
    const [totalListenTime, setTotalListenTime] = useState(0);
    const prevTrackId = usePrevious(currentTrack.data?.id);
    const { isMobile } = useScreen();

    useEffect(() => {
        if (prevTrackId !== currentTrack.data?.id) {
            setTotalListenTime(0);
            statSent = false;
        }

        if (player.current) {
            if (currentTrack.pause) {
                // @ts-ignore
                player.current.audio?.current?.pause();
            } else if (!currentTrack.pause && currentTrack.data) {
                //@ts-ignore
                player.current.audio?.current?.play();
            }
        }
    }, [currentTrack.pause, currentTrack.data, prevTrackId]);

    const onPause = () => {
        if (!currentTrack.pause) {
            currentTrack.setPause(true);
        }
    };

    const onPlay = () => {
        if (currentTrack.pause) {
            currentTrack.setPlay();
        }
    };

    const isAdminPage = () => {
        return location.pathname.includes('/admin/');
    };

    const onEnded = () => {
        currentTrack.onNext(isAdminPage(), isMobile);
    };

    const onClickNext = () => {
        currentTrack.onNext(isAdminPage(), isMobile);
    };

    const onClickPrevious = () => {
        currentTrack.onPrev(isAdminPage(), isMobile);
    };

    const renderHeader = () => {
        return (
            <div className={styles.title}>
                <span>{currentTrack.data?.title ? `${sign} - ${currentTrack.data?.title}` : ''}</span>
                {currentTrack.data && (
                    <Rating
                        trackId={currentTrack.data?.id!}
                        rating={currentTrack.data?.rating!}
                        isDidRating={currentTrack.data?.isDidRating!}
                        countRatings={currentTrack.data?.countRatings!}
                        notActiveByClick
                        white
                    />
                )}
            </div>
        );
    };

    const onListen = (e: any) => {
        const newCurrentTime = e.target.currentTime * 1000;

        // on repeat
        if (newCurrentTime < listenInterval) {
            setTotalListenTime(0);
            statSent = false;
        } else if (newCurrentTime > 0 && !currentTrack.pause) {
            const newTotalTime = totalListenTime + listenInterval;

            if (!statSent) {
                const halfTrackDuration = ((currentTrack.data?.duration || 0) / 2) * 1000;

                if (newTotalTime > halfTrackDuration && currentTrack.data?.id) {
                    stats.addTrackListenAction({ trackId: currentTrack.data?.id });
                    statSent = true;
                }
                setTotalListenTime(newTotalTime);
            }
        }
    };

    return createPortal(
        <div className={classNames(styles.player, className)}>
            <AudioPlayer
                // @ts-ignore
                ref={player}
                autoPlay
                autoPlayAfterSrcChange={false}
                src={currentTrack.data?.file?.url || ''}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
                header={renderHeader()}
                className={styles.playerContainer}
                showSkipControls
                onClickNext={onClickNext}
                onClickPrevious={onClickPrevious}
                listenInterval={listenInterval}
                onListen={onListen}
            />
        </div>,
        document.body,
    );
};

export default observer(Player);
