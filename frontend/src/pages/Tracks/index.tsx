import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
    AdminContentWrapper,
    AdminMenu,
    AdminPageTitle,
    PageWrapper,
    Header,
    PendingWrapper,
    Table,
    TableActions,
} from 'components';
import { useStore } from 'store';
import Pagination from './components/Pagination';

import { observer } from 'mobx-react-lite';
import TrackModal from './components/Modal';
import { ModalStateEnum } from 'types/modal';
import { SortEnum } from 'types/request';
import { Column } from 'components/Table';
import { Visible } from './components';
import { Track } from 'types/track';

import styles from './styles.module.scss';
import { formatDate, getDuration } from '../../helpers/formatters';

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
        tracks.getAll({}, { silent: false });
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

    const getFieldSort = (fieldKey: string) => {
        return tracks.store.meta.field === fieldKey ? tracks.store.meta.sort : undefined;
    };

    const getColumns = () => {
        return [
            {
                key: 'track_id',
                title: 'Id',
                sort: getFieldSort('track_id'),
            },
            {
                key: 'title',
                title: 'Title',
                width: '25%',
                sort: getFieldSort('title'),
            },
            {
                key: 'duration',
                title: 'Duration',
                sort: getFieldSort('duration'),
            },
            {
                key: 'category',
                title: 'Category',
                sort: getFieldSort('category'),
            },
            {
                key: 'genre',
                title: 'Genre',
                sort: getFieldSort('genre'),
            },
            {
                key: 'visible',
                title: 'Visible',
                sort: getFieldSort('visible'),
            },
            {
                key: 'createdAt',
                title: 'CreatedAt',
                sort: getFieldSort('createdAt'),
            },
            { key: 'actions', title: 'Actions', isSort: false },
        ];
    };

    const getRows = () => {
        return (
            tracks.store.data?.data?.map((track: Track) => ({
                track_id: track.id,
                id: track.id,
                title: track.title,
                duration: getDuration(track.duration),
                category: track.category.name,
                genre: track.genre.name,
                visible: <Visible track={track} />,
                createdAt: formatDate(track.createdAt),
                actions: (
                    <TableActions
                        onClickEdit={(e: any, cb: Function) => onClickEdit(e, track.id, cb)}
                        onClickDelete={(e: any, cb: Function) => onClickDelete(e, track.id, cb)}
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
            <PageWrapper>
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
            </PageWrapper>
        </div>
    );
};

export default observer(Tracks);
