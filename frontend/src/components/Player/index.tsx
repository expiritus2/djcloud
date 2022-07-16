import React, { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/src/styles.scss';

import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { sign } from 'settings/sign';
import styles from './styles.module.scss';
import './styles.scss';

type ComponentProps = {
    className?: string;
};

const Player: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { currentTrack } = useStore();
    const player = useRef();

    useEffect(() => {
        if (player.current) {
            if (currentTrack.pause) {
                // @ts-ignore
                player.current.audio?.current?.pause();
            } else if (!currentTrack.pause && currentTrack.data) {
                // @ts-ignore
                player.current.audio?.current?.play();
            }
        }
    }, [currentTrack.pause, currentTrack.data]);

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

    const onEnded = () => {
        currentTrack.onEnd();
    };

    const renderHeader = () => {
        return (
            <div className={styles.title}>
                {currentTrack.data?.title ? `${sign} - ${currentTrack.data?.title}` : ''}
            </div>
        );
    };

    return createPortal(
        <div className={classNames(styles.player, className)}>
            <AudioPlayer
                // @ts-ignore
                ref={player}
                autoPlay
                src={currentTrack.data?.file?.url}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
                header={renderHeader()}
                className={styles.playerContainer}
            />
        </div>,
        document.body,
    );
};

export default observer(Player);
