import React, { FC, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { ModalStateEnum } from 'types/modal';
import { RequestStateEnum } from 'types/request';

import { ContentModal, InputText } from 'components';
import { ButtonType } from 'components/ContentModal';

import { initModalState, InitModalStateType } from '../index';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    title: string;
    modalState: InitModalStateType;
    setModalState: any;
};

const initValues = { name: '' };

const GenreModal: FC<ComponentProps> = (props) => {
    const { modifyGenre, genres } = useStore();
    const { className, title, modalState, setModalState } = props;
    const [values, setValues] = useState(initValues);
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        if (modalState.type === ModalStateEnum.UPDATE) {
            setValues({ name: modifyGenre.data?.name || '' });
        }
    }, [modifyGenre.data, modalState.type]);

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
        genres.getAll();
    };

    const createGenre = () => {
        modifyGenre.create(values, {}, (err: AxiosError) => {
            if (!err) {
                refreshTable();
            }
        });
    };

    const updateGenre = () => {
        modifyGenre.update({ id: modalState.id as any, ...values }, {}, (err: AxiosError) => {
            if (!err) {
                refreshTable();
            }
        });
    };

    const removeGenre = () => {
        modifyGenre.remove({ id: modalState.id as any }, {}, (err: AxiosError) => {
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
            createGenre();
        }

        if (modalState.type === ModalStateEnum.UPDATE) {
            updateGenre();
        }

        if (modalState.type === ModalStateEnum.DELETE) {
            removeGenre();
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
            pending: modifyGenre.state === RequestStateEnum.PENDING,
        },
    ];

    const getDeleteText = () => {
        return (
            <div className={styles.deleteText}>
                Are you sure you want delete genre: <br />
                <span className={styles.accent}>{`${modifyGenre.data?.name}?`}</span>
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

export default observer(GenreModal);
