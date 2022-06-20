import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';

import { ContentModal, InputText } from 'components';
import { ButtonType } from 'components/ContentModal';
import { useStore } from 'store';

import { AxiosError } from 'axios';
import { initModalState, InitModalStateType } from '..';
import { observer } from 'mobx-react-lite';
import { ModalStateEnum } from 'types/modal';
import { RequestStateEnum } from 'types/request';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    title: string;
    modalState: InitModalStateType;
    setModalState: any;
};

const initValues = { name: '' };

const TrackModal: FC<ComponentProps> = (props) => {
    const { modifyTrack, tracks } = useStore();
    const { className, title, modalState, setModalState } = props;
    const [values, setValues] = useState(initValues);
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        if (modalState.type === ModalStateEnum.UPDATE) {
            setValues({ name: modifyTrack.store.data?.title || '' });
        }
    }, [modifyTrack.store.data, modalState.type]);

    if (!modalState.open) return null;

    const resetModal = () => {
        setModalState(initModalState);
        setInputError('');
        setValues(initValues);
    };

    const onClickCancel = () => {
        setModalState(initModalState);
        resetModal();
    };

    const refreshTable = () => {
        resetModal();
        tracks.getAll();
    };

    const createTrack = () => {
        modifyTrack.create(values, {}, (err: AxiosError) => {
            if (!err) {
                refreshTable();
            }
        });
    };

    const updateTrack = () => {
        modifyTrack.update({ id: modalState.id as any, ...values }, {}, (err: AxiosError) => {
            if (!err) {
                refreshTable();
            }
        });
    };

    const removeTrack = () => {
        modifyTrack.remove({ id: modalState.id as any }, {}, (err: AxiosError) => {
            if (!err) {
                refreshTable();
            }
        });
    };

    const onClickSubmit = (e: any) => {
        e.preventDefault();

        if (!values.name && modalState.type !== ModalStateEnum.DELETE) {
            return setInputError('Required');
        }

        if (modalState.type === ModalStateEnum.CREATE) {
            createTrack();
        }

        if (modalState.type === ModalStateEnum.UPDATE) {
            updateTrack();
        }

        if (modalState.type === ModalStateEnum.DELETE) {
            removeTrack();
        }
    };

    const onChangeName = (e: any) => {
        const { name, value } = e.target;
        setValues((prevVal) => ({ ...prevVal, [name]: value }));
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
            onClick: onClickSubmit,
            label: getSubmitButtonText(),
            variant: getSubmitButtonVariant(),
            pending: modifyTrack.store.state === RequestStateEnum.PENDING,
        },
    ];

    const getDeleteText = () => {
        return (
            <div className={styles.deleteText}>
                Are you sure you want delete track: <br />
                <span className={styles.accent}>{`${modifyTrack.store.data?.title}?`}</span>
            </div>
        );
    };

    const getContent = () => {
        return modalState.type === ModalStateEnum.DELETE ? (
            getDeleteText()
        ) : (
            <form onSubmit={onClickSubmit}>
                <InputText
                    error={inputError}
                    className={styles.input}
                    label="Name"
                    value={values.name}
                    name="name"
                    onChange={onChangeName}
                />
            </form>
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
