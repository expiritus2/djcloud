import React, { FC, forwardRef } from 'react';
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';
import classNames from 'classnames';
import { useScreen } from 'hooks';
import { observer } from 'mobx-react-lite';
import { MOBILE } from 'settings/constants/screen';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    iconClassName?: string;
    trackId: string;
};

const Play: FC<ComponentProps> = forwardRef<HTMLDivElement, ComponentProps>((props, ref) => {
    const { className, trackId, iconClassName } = props;
    const { currentTrack } = useStore();
    const { screen } = useScreen();

    const onPlay = () => {
        if (trackId) {
            currentTrack.resetStore();
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
        <div ref={ref} className={classNames(styles.play, className)}>
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
});

export default observer(Play);
