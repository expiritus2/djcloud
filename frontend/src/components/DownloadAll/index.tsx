import React, { FC, useState } from 'react';
import { ImFolderDownload } from 'react-icons/im';
import { MdUpload } from 'react-icons/md';
import classNames from 'classnames';
import { omit } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import { checkZipStatus, createZip, removeZip, ZipStatusResponse } from '../../api/files';
import { downloadByRequest } from '../../helpers/download';
import { showErrorMessage } from '../../helpers/errors';

import CreateZipSpinner from './CreateZipSpinner';
import DownloadProgress from './DownloadProgress';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    visible?: boolean;
};

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

const DownloadAll: FC<ComponentProps> = (props) => {
    const { className, visible } = props;
    const { tracks } = useStore();
    const [progress, setProgress] = useState(0);
    const [pending, setPending] = useState(false);
    const [uploadingToSpaces, setUploadingToSpaces] = useState(false);
    const [progressEventVal, setProgressEventVal] = useState<ProgressEvent | null>(null);

    if (!tracks.data) return null;

    const updateProgress = (data: ZipStatusResponse) => {
        if (data.progress < 100) {
            setProgress(data.progress);
        } else {
            setProgress(data.progress);
            setUploadingToSpaces(true);
        }
    };

    const checkZipStatusHandler = async (id: number, sleepTimeout: number): Promise<ZipStatusResponse> => {
        try {
            const { data } = await checkZipStatus({ id });
            updateProgress(data);
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
        setPending(false);
        setUploadingToSpaces(false);
        if (progressEvent.loaded < progressEvent.total) {
            setProgressEventVal(progressEvent);
        } else {
            setProgressEventVal(null);
        }
    };

    const downloadZip = async (pathToFile: string) => {
        await downloadByRequest(
            pathToFile,
            'tracks',
            () => {
                setPending(false);
            },
            downloadProgress,
        );
    };

    const createZipHandler = async ({ data: zipData }: { data: ZipStatusResponse }) => {
        const statusData = await checkZipStatusHandler(zipData.id, 100);
        if (statusData.countFiles !== null && statusData.countFiles === 0) {
            setPending(false);
            return;
        }
        await downloadZip(statusData.pathToFile);
        await removeZip({ id: statusData.id, url: statusData.pathToFile });
        setProgress(0);
    };

    const onDownload = async () => {
        setPending(true);
        const query = { visible, ...omit(tracks.meta, ['limit', 'page']) };
        createZip(query)
            .then(createZipHandler)
            .catch((err) => {
                setPending(false);
                showErrorMessage(err);
            });
    };

    const renderActions = () => {
        if (uploadingToSpaces) {
            return <MdUpload className={classNames(styles.icon, styles.uploading)} />;
        }

        if (pending) {
            return <CreateZipSpinner progress={progress} />;
        }

        if (progressEventVal !== null) {
            return <DownloadProgress progressEvent={progressEventVal} />;
        }

        return <ImFolderDownload onClick={onDownload} className={classNames(styles.icon)} />;
    };

    return <div className={classNames(styles.download, className)}>{renderActions()}</div>;
};

export default observer(DownloadAll);
