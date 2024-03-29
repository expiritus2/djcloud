import React, { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
  multiple?: boolean;
  onDrop: any;
  name: string;
  value: File;
  error?: string;
};

const DropZone: FC<ComponentProps> = (props) => {
  const { className, name, onDrop, multiple = false, value, error } = props;

  const onDropHandler = useCallback(
    (acceptedFiles: any) => {
      const file = multiple ? acceptedFiles : acceptedFiles[0];
      onDrop({ target: { name, value: file } });
    },
    [multiple, name, onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropHandler,
    multiple: false,
    accept: { 'audio/mpeg': [] },
  });

  const getText = () => {
    if (value) {
      return value.name;
    }
    if (isDragActive) {
      return 'Drop the files here ...';
    }

    return error ? (
      <div className={styles.error}>{error}</div>
    ) : (
      "Drag 'n' drop some files here, or click to select files"
    );
  };

  return (
    <div
      {...getRootProps()}
      className={classNames(styles.dropzone, error ? styles.error : '', className)}
    >
      <input {...getInputProps()} />
      <p className={styles.label}>{getText()}</p>
    </div>
  );
};

export default DropZone;
