import React, { FC, useState } from 'react';
import classNames from 'classnames';

import { AiFillDelete } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { DownloadTrack } from 'components';
import { Track } from 'types/track';
import Action from './Action';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    onClickEdit?: any;
    onClickDelete?: any;
    track?: Track;
};

const TableActions: FC<ComponentProps> = (props) => {
    const { className, onClickDelete, onClickEdit, track } = props;
    const [editPending, setEditPending] = useState(false);
    const [deletePending, setDeletePending] = useState(false);

    return (
        <div className={classNames(styles.tableActions, className)}>
            {track && (
                <DownloadTrack url={track?.file?.url || ''} title={track?.title || ''} className={styles.download} />
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
        </div>
    );
};

export default TableActions;
