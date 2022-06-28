import React, { FC } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Player: FC<ComponentProps> = (props) => {
    const { className } = props;

    return createPortal(
        <div className={classNames(styles.player, className)}>
            <AudioPlayer
                autoPlay
                src="http://example.com/audio.mp3"
                onPlay={(e) => console.log('onPlay', e)}
                // other props here
                header={<div>Header</div>}
            />
        </div>,
        document.body,
    );
};

export default Player;
