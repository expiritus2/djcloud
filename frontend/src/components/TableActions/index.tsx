import React, { FC, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { RxArchive } from 'react-icons/rx';
import classNames from 'classnames';
import { Track } from 'types/track';

import { DownloadTrack } from 'components';

import Action from './Action';
import SendToTelegram from './SendToTelegram';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    onClickEdit?: any;
    onClickDelete?: any;
    onClickArchive?: any;
    track?: Track;
};

const TableActions: FC<ComponentProps> = (props) => {
    const { className, onClickDelete, onClickEdit, onClickArchive, track } = props;
    const [editPending, setEditPending] = useState(false);
    const [deletePending, setDeletePending] = useState(false);
    const [archivePending, setArchivePending] = useState(false);

    return (
        <div className={classNames(styles.tableActions, className)}>
            {track && (
                <>
                    <SendToTelegram
                        className={styles.telegram}
                        iconClassName={classNames(styles.icon, styles.telegramIcon)}
                        track={track}
                    />
                    <DownloadTrack
                        url={track?.file?.url || ''}
                        title={track?.title || ''}
                        className={styles.download}
                        loaderWrapperClassName={styles.downloadLoaderWrapper}
                    />
                </>
            )}
            <Action isPending={editPending} loaderClassName={styles.editLoader}>
                <FaRegEdit
                    id="editIcon"
                    onClick={(e: any) => onClickEdit(e, setEditPending)}
                    className={classNames(styles.edit, styles.icon)}
                />
            </Action>
            <Action isPending={deletePending} loaderClassName={styles.deleteLoader}>
                <AiFillDelete
                    id="deleteIcon"
                    onClick={(e: any) => onClickDelete(e, setDeletePending)}
                    className={classNames(styles.remove, styles.icon)}
                />
            </Action>
            <Action isPending={archivePending} loaderClassName={styles.archiveLoader}>
                <RxArchive
                    id="archiveIcon"
                    onClick={(e: any) => onClickArchive(e, setArchivePending)}
                    className={classNames(styles.archive, styles.icon)}
                />
            </Action>
        </div>
    );
};

export default TableActions;
