import React, { FC, useState } from 'react';
import { ImFolderDownload } from 'react-icons/im';
import classNames from 'classnames';
import { omit } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import { Spinner } from 'components';

import { checkZipStatus, createZip, removeZip, ZipStatusResponse } from '../../api/files';
import { downloadByRequest } from '../../helpers/download';
import { showErrorMessage } from '../../helpers/errors';
import { LoaderTypeEnum } from '../Spinner';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    loaderWrapperClassName?: string;
    visible?: boolean;
};

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const DownloadAll: FC<ComponentProps> = (props) => {
    const { className, loaderWrapperClassName, visible } = props;
    const { tracks } = useStore();
    const [pending, setPending] = useState(false);
    const [progress, setProgress] = useState(0);

    const checkZipStatusHandler = async (id: number, sleepTimeout: number): Promise<ZipStatusResponse> => {
        try {
            const { data } = await checkZipStatus({ id });
            setProgress(data.progress);
            if (!data.isFinished) {
                await sleep(sleepTimeout);
                return await checkZipStatusHandler(id, 3000);
            }
            return data;
        } catch (err: any) {
            showErrorMessage(err);
            throw err;
        }
    };

    const downloadProgress = (progressEvent: any) => {
        console.log(progressEvent);
    };

    const onDownload = async () => {
        setPending(true);
        const query = { visible, ...omit(tracks.meta, ['limit', 'page']) };
        createZip(query)
            .then(async ({ data: zipData }) => {
                const statusData = await checkZipStatusHandler(zipData.id, 100);
                if (statusData.countFiles !== null && statusData.countFiles === 0) {
                    setPending(false);
                    return;
                }
                await downloadByRequest(
                    statusData.pathToFile,
                    'tracks',
                    () => {
                        setPending(false);
                    },
                    downloadProgress,
                );
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
                <>
                    <Spinner
                        className={styles.loader}
                        loaderWrapperClassName={classNames(styles.loaderWrapper, loaderWrapperClassName)}
                        loaderType={LoaderTypeEnum.CIRCLE}
                    />
                    <div className={styles.progress}>{progress}</div>
                </>
            ) : (
                <ImFolderDownload onClick={onDownload} className={classNames(styles.icon)} />
            )}
        </div>
    );
};

export default observer(DownloadAll);
