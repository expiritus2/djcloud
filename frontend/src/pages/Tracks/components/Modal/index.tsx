import React, { FC, useCallback, useMemo } from 'react';
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

    const resetModal = useCallback(() => {
        setModalState(initModalState);
    }, [setModalState]);

    const onClickCancel = useCallback(() => {
        setModalState(initModalState);
        resetModal();
    }, [resetModal, setModalState]);

    const refreshTable = useCallback(() => {
        resetModal();
        tracks.getAll();
    }, [resetModal, tracks]);

    const removeTrack = useCallback(() => {
        modifyTrack.remove({ id: modalState.id as any }, {}, (err: AxiosError) => {
            if (!err) {
                refreshTable();
                if (currentTrack.data?.id === modalState.id) {
                    currentTrack.resetStore();
                }
            }
        });
    }, [currentTrack, modalState.id, modifyTrack, refreshTable]);

    const archiveTrack = useCallback(() => {
        modifyTrack.archive({ id: modalState.id as any, archive: !modalState.data?.archive }, {}, (err: AxiosError) => {
            if (!err) {
                refreshTable();
                if (currentTrack.data?.id === modalState.id) {
                    currentTrack.resetStore();
                }
            }
        });
    }, [currentTrack, modalState.data?.archive, modalState.id, modifyTrack, refreshTable]);

    const onClickSubmit = useCallback(() => {
        if (modalState.type === ModalStateEnum.DELETE) {
            removeTrack();
        }

        if (modalState.type === ModalStateEnum.ARCHIVE) {
            archiveTrack();
        }
    }, [archiveTrack, modalState.type, removeTrack]);

    const submitButtonText = useMemo(() => {
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
    }, [modalState.type, tracks.meta.archive]);

    const submitButtonVariant: ButtonType['variant'] = useMemo(() => {
        if (modalState.type === ModalStateEnum.DELETE) {
            return 'danger';
        }
        return 'primary';
    }, [modalState.type]);

    const buttons: ButtonType[] = useMemo(
        () => [
            { id: 'cancel', onClick: onClickCancel, label: 'Cancel', variant: 'secondary' },
            {
                id: 'submit',
                formId: 'trackSubmit',
                type: 'submit',
                onClick: onClickSubmit,
                label: submitButtonText,
                variant: submitButtonVariant,
                pending: modifyTrack.state === RequestStateEnum.PENDING,
            },
        ],
        [submitButtonText, submitButtonVariant, modifyTrack.state, onClickCancel, onClickSubmit],
    );

    const deleteText = useMemo(() => {
        return (
            <div className={styles.deleteText}>
                Are you sure you want delete track: <br />
                <span className={styles.accent}>{`${modifyTrack.data?.title}?`}</span>
            </div>
        );
    }, [modifyTrack.data?.title]);

    const archiveText = useMemo(() => {
        return (
            <div className={styles.archiveText}>
                {`Are you sure you want to ${tracks.meta.archive ? 'unarchive' : 'archive'} track:`} <br />
                <span className={styles.accent}>{`${modifyTrack.data?.title}?`}</span>
            </div>
        );
    }, [modifyTrack.data?.title, tracks.meta.archive]);

    const content = useMemo(() => {
        if (modalState.type === ModalStateEnum.DELETE) {
            return deleteText;
        }

        if (modalState.type === ModalStateEnum.ARCHIVE) {
            return archiveText;
        }

        return <Form onClickSubmit={onClickSubmit} resetModal={resetModal} modalState={modalState} />;
    }, [archiveText, deleteText, modalState, onClickSubmit, resetModal]);

    return (
        <ContentModal
            open={modalState.open}
            title={title}
            buttons={buttons}
            className={classNames(styles.modal, className)}
        >
            <div className={styles.content}>{content}</div>
        </ContentModal>
    );
};

export default observer(TrackModal);
