import React, { FC, useState } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { FaTelegram } from 'react-icons/fa';
import { Track } from 'types/track';
import Action from '../Action';
import { useStore } from '../../../store';

type ComponentProps = {
    className?: string;
    iconClassName?: string;
    track: Track;
};

const SendToTelegram: FC<ComponentProps> = (props) => {
    const { className, iconClassName, track } = props;
    const { tracks } = useStore();
    const [isSendToTelegramPending, setIsSetToTelegramPending] = useState(false);

    const onClick = () => {
        setIsSetToTelegramPending(true);
        tracks.sendToTelegram({ trackId: track.id }, {}, () => {
            setIsSetToTelegramPending(false);
        });
    };

    return (
        <Action
            className={classNames(styles.sendToTelegram, className)}
            isPending={isSendToTelegramPending}
            loaderClassName={styles.telegramLoader}
        >
            <FaTelegram onClick={onClick} id="telegramIcon" className={iconClassName} />
        </Action>
    );
};

export default SendToTelegram;
