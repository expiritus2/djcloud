import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { useStore } from 'store';
import { ModalStateEnum } from 'types/modal';

import { CategoryInput, Checkbox, DropZone, GenreInput, InputText } from 'components';

import { InitModalStateType } from '../..';

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
  const { modifyTrack, tracks, tracksGenres } = useStore();
  const [values, setValues] = useState(initValues);
  const [inputError, setInputError] = useState(initialErrors);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (modalState.type === ModalStateEnum.UPDATE) {
      const track = modifyTrack.data;
      if (track) {
        setValues({ ...track });
      }
    }
  }, [modifyTrack.data, modalState.type]);

  const resetForm = useCallback(() => {
    resetModal();
    setInputError(initialErrors);
    setValues(initValues);
  }, [resetModal]);

  const refresh = useCallback(() => {
    resetForm();
    tracks.getAll();
    tracksGenres.getTracksGenres();
  }, [resetForm, tracks, tracksGenres]);

  const onUploadProgress = (progressEvent: any) => {
    const progress = (progressEvent.loaded / progressEvent.total) * 100;
    setProgressValue(progress);
  };

  const createTrack = useCallback(() => {
    modifyTrack.create(values, { onUploadProgress }, (err: AxiosError) => {
      if (!err) {
        refresh();
      }
    });
  }, [modifyTrack, refresh, values]);

  const updateTrack = useCallback(() => {
    modifyTrack.update(
      { id: modalState.id as any, ...values },
      { onUploadProgress },
      (err: AxiosError) => {
        if (!err) {
          refresh();
        }
      }
    );
  }, [modalState.id, modifyTrack, refresh, values]);

  const validateInputs = useCallback((): boolean => {
    let isErrors = false;
    if (modalState.type !== ModalStateEnum.DELETE) {
      const { title, category, genre, file } = values;
      isErrors = !title || !category || !genre || !file;
      setInputError({
        ...inputError,
        title: !title && 'Required',
        category: !category && 'Required',
        genre: !genre && 'Required',
        file: !file && 'Required',
      });
    }
    return isErrors;
  }, [inputError, values, modalState.type]);

  const onClickSubmitHandler = useCallback(
    (e: any) => {
      e.preventDefault();

      let isErrors = validateInputs();

      if (!isErrors && modalState.type === ModalStateEnum.CREATE) {
        createTrack();
      }

      if (!isErrors && modalState.type === ModalStateEnum.UPDATE) {
        updateTrack();
      }

      if (!isErrors) {
        onClickSubmit(e);
      }
    },
    [createTrack, modalState.type, onClickSubmit, updateTrack, validateInputs]
  );

  const resetError = useCallback(
    (name: string, value: any) => {
      if (value) {
        setInputError({ ...inputError, [name]: '' });
      }
    },
    [inputError]
  );

  const onChangeValue = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      resetError(name, value);
      setValues((prevVal: any) => ({ ...prevVal, [name]: value }));
    },
    [resetError]
  );

  return (
    <div className={classNames(styles.form, className)}>
      <form
        id="trackSubmit"
        onSubmit={onClickSubmitHandler}
      >
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
          error={inputError.category}
          className={styles.input}
          onChange={onChangeValue}
          name="category"
          value={values.category}
        />
        <GenreInput
          error={inputError.genre}
          className={styles.input}
          onChange={onChangeValue}
          name="genre"
          value={values.genre}
        />
        <DropZone
          error={inputError.file}
          onDrop={onChangeValue}
          name="file"
          className={styles.dropzone}
          value={values.file}
        />
      </form>
      <div
        style={{ width: `${progressValue}%` }}
        className={classNames(styles.progress, progressValue === 100 ? styles.hide : '')}
      ></div>
    </div>
  );
};

export default memo(Form);
