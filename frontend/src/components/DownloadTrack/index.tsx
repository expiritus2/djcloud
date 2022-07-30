import React, { FC, useState } from 'react';
import classNames from 'classnames';

import { FaDownload } from 'react-icons/fa';
import { downloadByRequest } from 'helpers/download';
import { sign } from 'settings/sign';
import { Spinner } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    url: string;
    title: string;
};

const DownloadTrack: FC<ComponentProps> = (props) => {
    const { className, url, title } = props;
    const [pending, setPending] = useState(false);

    const onDownload = () => {
        if (url && title) {
            setPending(true);
            downloadByRequest(url, `${sign}-${title}`, () => {
                setPending(false);
            });
        }
    };

    return (
        <div className={classNames(styles.download, className)}>
            {pending ? (
                <Spinner className={styles.loader} loaderWrapperClassName={styles.loaderWrapper} />
            ) : (
                <FaDownload onClick={onDownload} className={classNames(styles.icon)} />
            )}
        </div>
    );
};

export default DownloadTrack;
