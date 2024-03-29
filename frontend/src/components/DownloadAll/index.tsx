import React, { FC, useState } from 'react';
import { ImFolderDownload } from 'react-icons/im';
import { MdUpload } from 'react-icons/md';
import { PromisePool } from '@supercharge/promise-pool';
import { getStoredFiles } from 'api/files';
import axios from 'axios';
import classNames from 'classnames';
import { downloadByBlob } from 'helpers/download';
import { useScreen } from 'hooks';
import JSZip from 'jszip';
import { omit, round } from 'lodash';
import { observer } from 'mobx-react-lite';
import prettyBytes from 'pretty-bytes';
import { sign } from 'settings/sign';
import { useStore } from 'store';

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
  const { screen } = useScreen();
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

      downloadByBlob(zipContent, sign);
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

    return (
      <ImFolderDownload
        onClick={onDownload}
        className={classNames(styles.icon)}
      />
    );
  };

  return (
    <div className={classNames(styles.download, className)}>
      <span>{renderActions()}</span>
      {screen.width > 450 && (
        <span className={styles.totalFilesSize}>{`(${prettyBytes(
          tracks.data?.totalFilesSize || 0
        )})`}</span>
      )}
    </div>
  );
};

export default observer(DownloadAll);
