import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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

  const resetModal = useCallback(() => {
    setModalState(initModalState);
    setInputError('');
    setValues(initValues);
  }, [setModalState]);

  const onClickCancel = useCallback(() => {
    setModalState(initModalState);
    resetModal();
  }, [resetModal, setModalState]);

  const refreshTable = useCallback(() => {
    resetModal();
    genres.getAll();
  }, [genres, resetModal]);

  const createGenre = useCallback(() => {
    modifyGenre.create(values, {}, (err: AxiosError) => {
      if (!err) {
        refreshTable();
      }
    });
  }, [modifyGenre, refreshTable, values]);

  const updateGenre = useCallback(() => {
    modifyGenre.update({ id: modalState.id as any, ...values }, {}, (err: AxiosError) => {
      if (!err) {
        refreshTable();
      }
    });
  }, [modalState.id, modifyGenre, refreshTable, values]);

  const removeGenre = useCallback(() => {
    modifyGenre.remove({ id: modalState.id as any }, {}, (err: AxiosError) => {
      if (!err) {
        refreshTable();
      }
    });
  }, [modalState.id, modifyGenre, refreshTable]);

  const onClickSubmit = useCallback(
    (e: any) => {
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
    },
    [createGenre, modalState.type, removeGenre, updateGenre, values.name]
  );

  const onChangeName = (e: any) => {
    const { name, value } = e.target;
    setValues((prevVal) => ({ ...prevVal, [name]: value }));
  };

  const getSubmitButtonText = useCallback(() => {
    if (modalState.type === ModalStateEnum.UPDATE) {
      return 'Update';
    }

    if (modalState.type === ModalStateEnum.DELETE) {
      return 'Delete';
    }

    return 'Save';
  }, [modalState.type]);

  const getSubmitButtonVariant = useCallback((): ButtonType['variant'] => {
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
        onClick: onClickSubmit,
        label: getSubmitButtonText(),
        variant: getSubmitButtonVariant(),
        pending: modifyGenre.state === RequestStateEnum.PENDING,
      },
    ],
    [getSubmitButtonText, getSubmitButtonVariant, onClickCancel, modifyGenre.state, onClickSubmit]
  );

  const getDeleteText = useCallback(() => {
    return (
      <div className={styles.deleteText}>
        Are you sure you want delete genre: <br />
        <span className={styles.accent}>{`${modifyGenre.data?.name}?`}</span>
      </div>
    );
  }, [modifyGenre.data?.name]);

  const content = useMemo(() => {
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
  }, [getDeleteText, inputError, modalState.type, onClickSubmit, values.name]);

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

export default observer(GenreModal);
