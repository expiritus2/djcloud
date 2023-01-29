import React, { FC } from 'react';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { ModalStateEnum } from 'types/modal';
import { RequestStateEnum } from 'types/request';

import { ContentModal } from 'components';
import { ButtonType } from 'components/ContentModal';

import { initModalState, InitModalStateType } from '../../index';
import Form from '../Form';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    title: string;
    modalState: InitModalStateType;
    setModalState: any;
};

const TrackModal: FC<ComponentProps> = (props) => {
    const { modifyTrack, tracks, currentTrack } = useStore();
    const { className, title, modalState, setModalState } = props;

    const resetModal = () => {
        setModalState(initModalState);
    };

    const onClickCancel = () => {
        setModalState(initModalState);
        resetModal();
    };

    const refreshTable = () => {
        resetModal();
        tracks.getAll();
    };

    const removeTrack = () => {
        modifyTrack.remove({ id: modalState.id as any }, {}, (err: AxiosError) => {
            if (!err) {
                refreshTable();
                if (currentTrack.data?.id === modalState.id) {
                    currentTrack.resetStore();
                }
            }
        });
    };

    const archiveTrack = () => {
        modifyTrack.archive({ id: modalState.id as any, archive: !modalState.data?.archive }, {}, (err: AxiosError) => {
            if (!err) {
                refreshTable();
                if (currentTrack.data?.id === modalState.id) {
                    currentTrack.resetStore();
                }
            }
        });
    };

    const onClickSubmit = () => {
        if (modalState.type === ModalStateEnum.DELETE) {
            removeTrack();
        }

        if (modalState.type === ModalStateEnum.ARCHIVE) {
            archiveTrack();
        }
    };

    const getSubmitButtonText = () => {
        if (modalState.type === ModalStateEnum.UPDATE) {
            return 'Update';
        }

        if (modalState.type === ModalStateEnum.DELETE) {
            return 'Delete';
        }

        if (modalState.type === ModalStateEnum.ARCHIVE) {
            return tracks.meta.archive ? 'Unarchive' : 'Archive';
        }

        return 'Save';
    };

    const getSubmitButtonVariant = (): ButtonType['variant'] => {
        if (modalState.type === ModalStateEnum.DELETE) {
            return 'danger';
        }
        return 'primary';
    };

    const buttons: ButtonType[] = [
        { id: 'cancel', onClick: onClickCancel, label: 'Cancel', variant: 'secondary' },
        {
            id: 'submit',
            formId: 'trackSubmit',
            type: 'submit',
            onClick: onClickSubmit,
            label: getSubmitButtonText(),
            variant: getSubmitButtonVariant(),
            pending: modifyTrack.state === RequestStateEnum.PENDING,
        },
    ];

    const getDeleteText = () => {
        return (
            <div className={styles.deleteText}>
                Are you sure you want delete track: <br />
                <span className={styles.accent}>{`${modifyTrack.data?.title}?`}</span>
            </div>
        );
    };

    const getArchiveText = () => {
        return (
            <div className={styles.archiveText}>
                {`Are you sure you want to ${tracks.meta.archive ? 'unarchive' : 'archive'} track:`} <br />
                <span className={styles.accent}>{`${modifyTrack.data?.title}?`}</span>
            </div>
        );
    };

    const getContent = () => {
        if (modalState.type === ModalStateEnum.DELETE) {
            return getDeleteText();
        }

        if (modalState.type === ModalStateEnum.ARCHIVE) {
            return getArchiveText();
        }

        return <Form onClickSubmit={onClickSubmit} resetModal={resetModal} modalState={modalState} />;
    };

    return (
        <ContentModal
            open={modalState.open}
            title={title}
            buttons={buttons}
            className={classNames(styles.modal, className)}
        >
            <div className={styles.content}>{getContent()}</div>
        </ContentModal>
    );
};

export default observer(TrackModal);
