import React, { FC } from 'react';
import classNames from 'classnames';
import prettyBytes from 'pretty-bytes';

import styles from './styles.module.scss';

type ProgressEvent = {
    loaded: number;
    total: number;
};

type ComponentProps = {
    className?: string;
    progressEvent: ProgressEvent;
};

const DownloadProgress: FC<ComponentProps> = (props) => {
    const { className, progressEvent } = props;

    return (
        <div className={classNames(styles.downloadProgress, className)}>
            <span className={styles.downloadPart}>{`${prettyBytes(progressEvent.loaded)}`}</span>
            <span>/</span>
            <span>{`${prettyBytes(progressEvent.total)}`}</span>
        </div>
    );
};

export default DownloadProgress;
