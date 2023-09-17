import React, { FC } from 'react';
import classNames from 'classnames';
import { formatDate, getDuration } from 'helpers/formatters';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { ModalStateEnum } from 'types/modal';
import { SortEnum } from 'types/request';
import { Track } from 'types/track';

import { Table, TableActions } from 'components';
import { Column } from 'components/Table';

import Pagination from '../Pagination';
import { Title, Visible } from '..';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    setModalState: Function;
};

const TableComponent: FC<ComponentProps> = (props) => {
    const { className, setModalState } = props;
    const { tracks, modifyTrack } = useStore();

    const onClickEdit = (e: any, id: string, cb: Function) => {
        cb(true);
        modifyTrack.getById({ id }, {}, (err: any) => {
            if (!err) {
                cb(false);
                setModalState({ id, type: ModalStateEnum.UPDATE, open: true });
            }
        });
    };

    const onClickDelete = (e: any, id: string, cb: Function) => {
        cb(true);
        modifyTrack.getById({ id }, {}, (err: any) => {
            if (!err) {
                cb(false);
                setModalState({ id, type: ModalStateEnum.DELETE, open: true });
            }
        });
    };

    const onClickArchive = (e: any, id: string, cb: Function) => {
        cb(true);
        modifyTrack.getById({ id }, {}, (err: any, response: any) => {
            if (!err) {
                cb(false);
                setModalState({ id, type: ModalStateEnum.ARCHIVE, open: true, data: response.data });
            }
        });
    };

    const getFieldSort = (fieldKey: string) => {
        return tracks.meta.field === fieldKey ? tracks.meta.sort : undefined;
    };

    const getColumns = () => {
        return [
            {
                key: 'id',
                title: 'Id',
                // sort: getFieldSort('track_id'),
                sort: ['id', 'createdAt'].includes(tracks.meta.field) ? tracks.meta.sort : undefined,
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
            ...(!tracks.meta.archive
                ? [
                      {
                          key: 'visible',
                          title: 'Visible',
                          sort: getFieldSort('visible'),
                      },
                  ]
                : []),
            {
                key: 'listenCount',
                title: 'Listened',
                sort: getFieldSort('listenCount'),
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
            tracks.data?.data?.map((track: Track) => {
                return {
                    // track_id: track.id,
                    id: track.id,
                    title: <Title {...track} />,
                    duration: getDuration(track.duration),
                    category: track.category.name,
                    genre: track.genre.name,
                    ...(!tracks.meta.visible ? { visible: <Visible track={track} /> } : {}),
                    createdAt: formatDate(track.createdAt),
                    listenCount: track.listenStats?.listenCount || 0,
                    actions: (
                        <TableActions
                            track={track}
                            onClickEdit={(e: any, cb: Function) => onClickEdit(e, track.id, cb)}
                            onClickDelete={(e: any, cb: Function) => onClickDelete(e, track.id, cb)}
                            onClickArchive={(e: any, cb: Function) => onClickArchive(e, track.id, cb)}
                        />
                    ),
                };
            }) || []
        );
    };

    const onSortClick = (e: any, column: Column) => {
        const field = ['id', 'createdAt'].includes(column.key) ? 'createdAt' : column.key;
        tracks.getAll(
            { field, sort: column.sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC, page: 0 },
            { silent: true },
        );
    };

    return (
        <div className={classNames(styles.tracksTable, className)}>
            <Table columns={getColumns()} rows={getRows()} onSortClick={onSortClick} className={styles.table} />
            <Pagination />
        </div>
    );
};

export default observer(TableComponent);
