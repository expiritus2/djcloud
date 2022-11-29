import React, { FC, useState } from 'react';
import { ImFolderDownload } from 'react-icons/im';
import classNames from 'classnames';

import { Spinner } from 'components';

import { checkZipStatus, createZip, removeZip, ZipStatusResponse } from '../../api/files';
import { downloadByRequest } from '../../helpers/download';
import { showErrorMessage } from '../../helpers/errors';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    loaderWrapperClassName?: string;
    visible: boolean;
};

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const DownloadAll: FC<ComponentProps> = (props) => {
    const { className, loaderWrapperClassName, visible } = props;
    const [pending, setPending] = useState(false);

    const checkZipStatusHandler = async (id: number): Promise<ZipStatusResponse> => {
        const { data } = await checkZipStatus({ id });
        if (!data.isFinished) {
            await sleep(3000);
            return checkZipStatusHandler(id);
        }
        return data;
    };

    const onDownload = async () => {
        setPending(true);
        createZip({ visible })
            .then(async ({ data: zipData }) => {
                const statusData = await checkZipStatusHandler(zipData.id);
                await downloadByRequest(statusData.pathToFile, 'tracks', () => {
                    setPending(false);
                });
                await removeZip({ id: statusData.id, url: statusData.pathToFile });
            })
            .catch((err) => {
                setPending(false);
                showErrorMessage(err);
            });
    };

    return (
        <div className={classNames(styles.download, className)}>
            {pending ? (
                <Spinner
                    className={styles.loader}
                    loaderWrapperClassName={classNames(styles.loaderWrapper, loaderWrapperClassName)}
                />
            ) : (
                <ImFolderDownload onClick={onDownload} className={classNames(styles.icon)} />
            )}
        </div>
    );
};

export default DownloadAll;
