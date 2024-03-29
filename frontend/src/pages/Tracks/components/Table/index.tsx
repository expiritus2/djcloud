import React, { FC, useCallback, useMemo } from 'react';
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

  const onClickEdit = useCallback(
    (e: any, id: number, cb: Function) => {
      cb(true);
      modifyTrack.getById({ id }, {}, (err: any) => {
        if (!err) {
          cb(false);
          setModalState({ id, type: ModalStateEnum.UPDATE, open: true });
        }
      });
    },
    [modifyTrack, setModalState]
  );

  const onClickDelete = useCallback(
    (e: any, id: number, cb: Function) => {
      cb(true);
      modifyTrack.getById({ id }, {}, (err: any) => {
        if (!err) {
          cb(false);
          setModalState({ id, type: ModalStateEnum.DELETE, open: true });
        }
      });
    },
    [modifyTrack, setModalState]
  );

  const onClickArchive = useCallback(
    (e: any, id: number, cb: Function) => {
      cb(true);
      modifyTrack.getById({ id }, {}, (err: any, response: any) => {
        if (!err) {
          cb(false);
          setModalState({ id, type: ModalStateEnum.ARCHIVE, open: true, data: response.data });
        }
      });
    },
    [modifyTrack, setModalState]
  );

  const getFieldSort = useCallback(
    (fieldKey: string) => {
      return tracks.meta.field === fieldKey ? tracks.meta.sort : undefined;
    },
    [tracks.meta.field, tracks.meta.sort]
  );

  const columns = useMemo(() => {
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
  }, [getFieldSort, tracks.meta.archive]);

  const rows = useMemo(() => {
    return (
      tracks.data?.data?.map((track: Track) => {
        return {
          track_id: track.id,
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
  }, [onClickArchive, onClickEdit, onClickDelete, tracks.data?.data, tracks.meta.visible]);

  const onSortClick = (e: any, column: Column) => {
    tracks.getAll(
      {
        field: column.key,
        sort: column.sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC,
        page: 0,
      },
      { silent: true }
    );
  };

  return (
    <div className={classNames(styles.tracksTable, className)}>
      <Table
        columns={columns}
        rows={rows}
        onSortClick={onSortClick}
        className={styles.table}
      />
      <Pagination />
    </div>
  );
};

export default observer(TableComponent);
