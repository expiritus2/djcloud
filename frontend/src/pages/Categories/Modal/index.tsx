import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { ModalStateEnum } from 'types/modal';
import { RequestStateEnum, SortEnum } from 'types/request';

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

const CategoryModal: FC<ComponentProps> = (props) => {
  const { modifyCategory, categories } = useStore();
  const { className, title, modalState, setModalState } = props;
  const [values, setValues] = useState(initValues);
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    if (modalState.type === ModalStateEnum.UPDATE) {
      setValues({ name: modifyCategory.data?.name || '' });
    }
  }, [modifyCategory.data, modalState.type]);

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
    categories.getAll({ sort: SortEnum.DESC });
  }, [categories, resetModal]);

  const createCategory = useCallback(() => {
    modifyCategory.create(values, {}, (err: AxiosError) => {
      if (!err) {
        refreshTable();
      }
    });
  }, [modifyCategory, refreshTable, values]);

  const updateCategory = useCallback(() => {
    modifyCategory.update({ id: modalState.id as any, ...values }, {}, (err: AxiosError) => {
      if (!err) {
        refreshTable();
      }
    });
  }, [modalState.id, modifyCategory, refreshTable, values]);

  const removeCategory = useCallback(() => {
    modifyCategory.remove({ id: modalState.id as any }, {}, (err: AxiosError) => {
      if (!err) {
        refreshTable();
      }
    });
  }, [modalState.id, modifyCategory, refreshTable]);

  const onClickSubmit = useCallback(
    (e: any) => {
      e.preventDefault();

      if (!values.name && modalState.type !== ModalStateEnum.DELETE) {
        return setInputError('Required');
      }

      if (modalState.type === ModalStateEnum.CREATE) {
        createCategory();
      }

      if (modalState.type === ModalStateEnum.UPDATE) {
        updateCategory();
      }

      if (modalState.type === ModalStateEnum.DELETE) {
        removeCategory();
      }
    },
    [createCategory, modalState.type, removeCategory, updateCategory, values.name]
  );

  const onChangeName = useCallback((e: any) => {
    const { name, value } = e.target;
    setValues((prevVal) => ({ ...prevVal, [name]: value }));
  }, []);

  const submitButtonText = useMemo(() => {
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
        label: submitButtonText,
        variant: getSubmitButtonVariant(),
        pending: modifyCategory.state === RequestStateEnum.PENDING,
      },
    ],
    [submitButtonText, getSubmitButtonVariant, onClickCancel, modifyCategory.state, onClickSubmit]
  );

  const getDeleteText = useCallback(() => {
    return (
      <div className={styles.deleteText}>
        Are you sure you want delete category: <br />
        <span className={styles.accent}>{`${modifyCategory.data?.name}?`}</span>
      </div>
    );
  }, [modifyCategory.data?.name]);

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
  }, [getDeleteText, inputError, modalState.type, onClickSubmit, values.name, onChangeName]);

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

export default observer(CategoryModal);
