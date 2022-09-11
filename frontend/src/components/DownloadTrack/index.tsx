import React, { FC, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import classNames from 'classnames';
import { downloadByRequest } from 'helpers/download';
import { sign } from 'settings/sign';

import { Spinner } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    url: string;
    title: string;
    loaderWrapperClassName?: string;
};

const DownloadTrack: FC<ComponentProps> = (props) => {
    const { className, url, title, loaderWrapperClassName } = props;
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
                <Spinner
                    className={styles.loader}
                    loaderWrapperClassName={classNames(styles.loaderWrapper, loaderWrapperClassName)}
                />
            ) : (
                <FaDownload onClick={onDownload} className={classNames(styles.icon)} />
            )}
        </div>
    );
};

export default DownloadTrack;
