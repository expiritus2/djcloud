import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { Table, TableActions } from 'components';
import { Column } from 'components/Table';
import { SortEnum } from 'types/request';
import { Track } from 'types/track';
import { Title, Visible } from '..';
import { formatDate, getDuration } from 'helpers/formatters';
import { ModalStateEnum } from 'types/modal';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';

import Pagination from '../Pagination';

type ComponentProps = {
    className?: string;
    setModalState: Function;
};

const TableComponent: FC<ComponentProps> = (props) => {
    const { className, setModalState } = props;
    const { tracks, modifyTrack } = useStore();

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

    const getFieldSort = (fieldKey: string) => {
        return tracks.meta.field === fieldKey ? tracks.meta.sort : undefined;
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
                    track_id: track.id,
                    id: track.id,
                    title: <Title {...track} />,
                    duration: getDuration(track.duration),
                    category: track.category.name,
                    genre: track.genre.name,
                    visible: <Visible track={track} />,
                    createdAt: formatDate(track.createdAt),
                    listenCount: track.listenStats?.listenCount || 0,
                    actions: (
                        <TableActions
                            track={track}
                            onClickEdit={(e: any, cb: Function) => onClickEdit(e, track.id, cb)}
                            onClickDelete={(e: any, cb: Function) => onClickDelete(e, track.id, cb)}
                        />
                    ),
                };
            }) || []
        );
    };

    const onSortClick = (e: any, column: Column) => {
        tracks.getAll(
            { field: column.key, sort: column.sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC, page: 0 },
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
