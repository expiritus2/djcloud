import React, { FC } from 'react';
import classNames from 'classnames';

import { ContentModal } from 'components';
import { ButtonType } from 'components/ContentModal';
import { useStore } from 'store';

import { AxiosError } from 'axios';
import { initModalState, InitModalStateType } from '../../index';
import { observer } from 'mobx-react-lite';
import { ModalStateEnum } from 'types/modal';
import { RequestStateEnum } from 'types/request';
import Form from '../Form';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    title: string;
    modalState: InitModalStateType;
    setModalState: any;
};

const TrackModal: FC<ComponentProps> = (props) => {
    const { modifyTrack, tracks } = useStore();
    const { className, title, modalState, setModalState } = props;

    if (!modalState.open) return null;

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
            }
        });
    };

    const onClickSubmit = () => {
        if (modalState.type === ModalStateEnum.DELETE) {
            removeTrack();
        }
    };

    const getSubmitButtonText = () => {
        if (modalState.type === ModalStateEnum.UPDATE) {
            return 'Update';
        }

        if (modalState.type === ModalStateEnum.DELETE) {
            return 'Delete';
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

    const getContent = () => {
        return modalState.type === ModalStateEnum.DELETE ? (
            getDeleteText()
        ) : (
            <Form onClickSubmit={onClickSubmit} resetModal={resetModal} modalState={modalState} />
        );
    };

    return (
        <div className={styles.opacityLayer}>
            <ContentModal title={title} buttons={buttons} className={classNames(styles.modal, className)}>
                <div className={styles.content}>{getContent()}</div>
            </ContentModal>
        </div>
    );
};

export default observer(TrackModal);
