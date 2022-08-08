import React, { FC, useState } from 'react';
import classNames from 'classnames';

import { FaTelegram } from 'react-icons/fa';
import { Track } from 'types/track';
import Action from '../Action';
import { useStore } from 'store';
import { ContentModal } from '../..';
import { ButtonType } from '../../ContentModal';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    iconClassName?: string;
    track: Track;
};

const SendToTelegram: FC<ComponentProps> = (props) => {
    const { className, iconClassName, track } = props;
    const { tracks } = useStore();
    const [openModal, setOpenModal] = useState(false);
    const [isSendToTelegramPending, setIsSetToTelegramPending] = useState(false);

    const onClick = () => {
        setOpenModal(true);
    };

    const onClickCancel = () => {
        setOpenModal(false);
    };

    const onClickSubmit = () => {
        setIsSetToTelegramPending(true);
        tracks.sendToTelegram({ trackId: track.id }, {}, () => {
            setIsSetToTelegramPending(false);
            setOpenModal(false);
        });
    };

    const buttons: ButtonType[] = [
        { id: 'cancel', onClick: onClickCancel, label: 'Cancel', variant: 'secondary' },
        {
            id: 'submit',
            formId: 'trackSubmit',
            type: 'submit',
            onClick: onClickSubmit,
            label: 'Submit',
            variant: 'primary',
            pending: isSendToTelegramPending,
        },
    ];

    return (
        <div>
            <Action
                className={classNames(styles.sendToTelegram, className)}
                isPending={isSendToTelegramPending}
                loaderClassName={styles.telegramLoader}
            >
                <FaTelegram onClick={onClick} id="telegramIcon" className={iconClassName} />
            </Action>
            <ContentModal
                open={openModal}
                title="Confirm send to telegram"
                buttons={buttons}
                className={classNames(styles.modal, className)}
            >
                <div className={styles.content}>
                    <span className={styles.message}>
                        Are you sure you want to send track: <span className={styles.accent}>{track.title}</span> to
                        telegram?
                    </span>
                </div>
            </ContentModal>
        </div>
    );
};

export default SendToTelegram;
