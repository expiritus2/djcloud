import React, { FC, useState } from 'react';
import { ImFolderDownload } from 'react-icons/im';
import { MdUpload } from 'react-icons/md';
import { PromisePool } from '@supercharge/promise-pool';
import axios from 'axios';
import classNames from 'classnames';
import JSZip from 'jszip';
import { omit, round } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import { getStoredFiles } from '../../api/files';
import { downloadByBlob } from '../../helpers/download';

import CreateZipSpinner from './CreateZipSpinner';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    visible?: boolean;
};

const streamFile = (fileUrl: string, isDisableCache = false) => {
    const url = isDisableCache ? `${fileUrl}?${Date.now()}` : fileUrl;
    return axios.get(url, { responseType: 'arraybuffer' });
};

const DownloadAll: FC<ComponentProps> = (props) => {
    const { className, visible } = props;
    const { tracks } = useStore();
    const [progress, setProgress] = useState(0);
    const [pending, setPending] = useState(false);
    const [packZip, setPackZip] = useState(false);

    if (!tracks.data) return null;

    const onDownload = async () => {
        const query = { visible, ...omit(tracks.meta, ['limit', 'page']) };
        const { data: storedFiles } = await getStoredFiles(query);
        const zip = new JSZip();
        setPending(!!storedFiles.length);
        await PromisePool.withConcurrency(20)
            .for(storedFiles)
            .onTaskFinished(async (storedFile, pool) => {
                const processedPercentage = pool.processedPercentage();
                setProgress(round(processedPercentage));
            })
            .process(async (storedFile) => {
                const { data: trackData } = await streamFile(storedFile.fileUrl, true);
                const ext = storedFile.fileName.split('.').pop();
                zip.file(`${storedFile.title}.${ext}`, trackData);
            });
        if (storedFiles.length) {
            setPackZip(true);
            const zipContent = await zip.generateAsync({ type: 'blob' });
            setPackZip(false);

            downloadByBlob(zipContent, 'tracks');
            setPending(false);
        }
    };

    const renderActions = () => {
        if (packZip) {
            return <MdUpload className={classNames(styles.icon, styles.uploading)} />;
        }

        if (pending) {
            return <CreateZipSpinner progress={progress} />;
        }

        return <ImFolderDownload onClick={onDownload} className={classNames(styles.icon)} />;
    };

    return <div className={classNames(styles.download, className)}>{renderActions()}</div>;
};

export default observer(DownloadAll);
