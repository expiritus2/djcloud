import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';

import { InputText, CategoryInput, GenreInput, DropZone, Checkbox } from 'components';
import { ModalStateEnum } from 'types/modal';
import { AxiosError } from 'axios';
import { useStore } from 'store';
import { InitModalStateType } from '../../index';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    onClickSubmit: any;
    resetModal: Function;
    modalState: InitModalStateType;
};

const initValues: any = { visible: false, title: '', category: null, genre: null, file: null };
const initialErrors: any = { title: '', category: '', genre: '', file: '' };

const Form: FC<ComponentProps> = (props) => {
    const { className, resetModal, modalState, onClickSubmit } = props;
    const { modifyTrack, tracks } = useStore();
    const [values, setValues] = useState(initValues);
    const [inputError, setInputError] = useState(initialErrors);

    useEffect(() => {
        if (modalState.type === ModalStateEnum.UPDATE) {
            const track = modifyTrack.data;
            if (track) {
                setValues({ ...track });
            }
        }
    }, [modifyTrack.data, modalState.type]);

    const resetForm = () => {
        resetModal();
        setInputError(initialErrors);
        setValues(initValues);
    };

    const refreshTable = () => {
        resetForm();
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

    const onClickSubmitHandler = (e: any) => {
        e.preventDefault();

        if (!values.title && modalState.type !== ModalStateEnum.DELETE) {
            return setInputError({ ...inputError, title: 'Required' });
        }

        if (modalState.type === ModalStateEnum.CREATE) {
            createTrack();
        }

        if (modalState.type === ModalStateEnum.UPDATE) {
            updateTrack();
        }

        onClickSubmit(e);
    };

    const resetError = (name: string, value: any) => {
        if (value) {
            setInputError({ ...inputError, [name]: '' });
        }
    };

    const onChangeValue = (e: any) => {
        const { name, value } = e.target;
        resetError(name, value);
        setValues((prevVal: any) => ({ ...prevVal, [name]: value }));
    };

    return (
        <div className={classNames(styles.form, className)}>
            <form id="trackSubmit" onSubmit={onClickSubmitHandler}>
                <Checkbox
                    label="Visible"
                    checked={values.visible}
                    name="visible"
                    onChange={onChangeValue}
                    className={styles.input}
                />
                <InputText
                    error={inputError.title}
                    className={styles.input}
                    label="Title"
                    value={values.title}
                    name="title"
                    onChange={onChangeValue}
                />
                <CategoryInput
                    className={styles.input}
                    onChange={onChangeValue}
                    name="category"
                    value={values.category}
                />
                <GenreInput className={styles.input} onChange={onChangeValue} name="genre" value={values.genre} />
                <DropZone onDrop={onChangeValue} name="file" className={styles.dropzone} value={values.file} />
            </form>
        </div>
    );
};

export default Form;
