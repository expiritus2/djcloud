import React, { FC, useCallback } from 'react';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    multiple?: boolean;
    onDrop: any;
    name: string;
    value: File;
};

const DropZone: FC<ComponentProps> = (props) => {
    const { className, name, onDrop, multiple = false, value } = props;

    const onDropHandler = useCallback(
        (acceptedFiles: any) => {
            const file = multiple ? acceptedFiles : acceptedFiles[0];
            onDrop({ target: { name, value: file } });
        },
        [multiple, name, onDrop],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: onDropHandler,
        multiple: false,
        accept: { 'audio/*': [] },
    });

    const getText = () => {
        if (value) {
            return value.name;
        }
        if (isDragActive) {
            return 'Drop the files here ...';
        }

        return "Drag 'n' drop some files here, or click to select files";
    };

    return (
        <div {...getRootProps()} className={classNames(styles.dropzone, className)}>
            <input {...getInputProps()} />
            <p className={styles.label}>{getText()}</p>
        </div>
    );
};

export default DropZone;
