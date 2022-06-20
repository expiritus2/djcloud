import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
    AdminContentWrapper,
    AdminMenu,
    AdminPageTitle,
    AdminPageWrapper,
    Header,
    PendingWrapper,
    Table,
    TableActions,
} from 'components';
import { useStore } from 'store';
import Pagination from './Pagination';

import { observer } from 'mobx-react-lite';
import TrackModal from './Modal';
import { ModalStateEnum } from 'types/modal';
import { SortEnum } from 'types/request';
import { Column } from 'components/Table';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

export type InitModalStateType = { id?: number | undefined; type: ModalStateEnum | null; open: boolean };
export const initModalState: InitModalStateType = { id: undefined, type: null, open: false };

const Tracks: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks, modifyTrack } = useStore();
    const [modalState, setModalState] = useState(initModalState);

    useEffect(() => {
        tracks.getAll({ field: 'track_id', sort: SortEnum.ASC, limit: 15 }, { silent: false });
    }, []); // eslint-disable-line

    const onClickEdit = (e: any, id: number, cb: Function) => {
        cb(true);
        modifyTrack.getById({ id }, {}, (err: any) => {
            if (!err) {
                cb(false);
                setModalState({ id, type: ModalStateEnum.UPDATE, open: true });
            }
        });
    };

    const onClickDelete = (e: any, id: number, cb: Function) => {
        cb(true);
        modifyTrack.getById({ id }, {}, (err: any) => {
            if (!err) {
                cb(false);
                setModalState({ id, type: ModalStateEnum.DELETE, open: true });
            }
        });
    };

    const onClickNew = () => {
        setModalState({ type: ModalStateEnum.CREATE, open: true });
    };

    const getColumns = () => {
        return [
            {
                key: 'track_id',
                title: 'Id',
                width: '33%',
                sort: tracks.store.meta.field === 'id' ? tracks.store.meta.sort : undefined,
            },
            {
                key: 'title',
                title: 'Title',
                width: '33%',
                sort: tracks.store.meta.field === 'title' ? tracks.store.meta.sort : undefined,
            },
            { key: 'actions', title: 'Actions', width: '33%', isSort: false },
        ];
    };

    const getRows = () => {
        return (
            tracks.store.data?.data?.map((row) => ({
                track_id: row.id,
                title: row.title,
                actions: (
                    <TableActions
                        onClickEdit={(e: any, cb: Function) => onClickEdit(e, row.id, cb)}
                        onClickDelete={(e: any, cb: Function) => onClickDelete(e, row.id, cb)}
                    />
                ),
            })) || []
        );
    };

    const getModalTitle = () => {
        if (modalState.type === ModalStateEnum.UPDATE) {
            return 'Update Track';
        }

        if (modalState.type === ModalStateEnum.DELETE) {
            return 'Delete Track';
        }

        return 'Create Track';
    };

    const onSortClick = (e: any, column: Column) => {
        tracks.getAll(
            { field: column.key, sort: column.sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC, page: 0 },
            { silent: true },
        );
    };

    return (
        <div className={classNames(styles.tracks, className)}>
            <Header />
            <AdminPageWrapper>
                <>
                    <AdminMenu />
                    <AdminContentWrapper>
                        <PendingWrapper state={tracks.store.state} className={styles.pendingWrapper}>
                            <>
                                <AdminPageTitle title="Tracks" onClickNew={onClickNew} />
                                <Table
                                    columns={getColumns()}
                                    rows={getRows()}
                                    onSortClick={onSortClick}
                                    className={styles.table}
                                />
                                <Pagination />
                                <TrackModal
                                    title={getModalTitle()}
                                    modalState={modalState}
                                    setModalState={setModalState}
                                />
                            </>
                        </PendingWrapper>
                    </AdminContentWrapper>
                </>
            </AdminPageWrapper>
        </div>
    );
};

export default observer(Tracks);
