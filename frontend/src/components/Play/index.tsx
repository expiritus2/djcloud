import React, { FC } from 'react';
import classNames from 'classnames';

import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';
import { useStore } from 'store';
import { MOBILE } from 'settings/constants/screen';

import { observer } from 'mobx-react-lite';
import { useScreen } from 'hooks';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    iconClassName?: string;
    trackId: number;
};

const Play: FC<ComponentProps> = (props) => {
    const { className, trackId, iconClassName } = props;
    const { currentTrack } = useStore();
    const { screen } = useScreen();

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

    const mobileClass = screen.width <= MOBILE ? styles.mobile : '';

    return (
        <div className={classNames(styles.play, className)}>
            {!currentTrack.pause && currentTrack.data?.id === trackId ? (
                <AiFillPauseCircle
                    onClick={onPause}
                    className={classNames(styles.headIcon, mobileClass, iconClassName)}
                />
            ) : (
                <AiFillPlayCircle
                    onClick={onPlay}
                    className={classNames(styles.headIcon, mobileClass, iconClassName)}
                />
            )}
        </div>
    );
};

export default observer(Play);
