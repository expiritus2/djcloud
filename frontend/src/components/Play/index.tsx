import React, { FC } from 'react';
import classNames from 'classnames';

import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';
import { useStore } from 'store';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

type ComponentProps = {
    className?: string;
    iconClassName?: string;
    trackId: number;
};

const Play: FC<ComponentProps> = (props) => {
    const { className, trackId, iconClassName } = props;
    const { currentTrack } = useStore();

    const onPlay = () => {
        if (trackId) {
            currentTrack.getTrackById({ id: trackId });
        }
    };

    const onPause = () => {
        if (!currentTrack.pause) {
            currentTrack.setPause(true);
        }
    };

    return (
        <div className={classNames(styles.play, className)}>
            {!currentTrack.pause && currentTrack.data?.id == trackId ? (
                <AiFillPauseCircle onClick={onPause} className={classNames(styles.headIcon, iconClassName)} />
            ) : (
                <AiFillPlayCircle onClick={onPlay} className={classNames(styles.headIcon, iconClassName)} />
            )}
        </div>
    );
};

export default observer(Play);
