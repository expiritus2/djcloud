import React, { FC, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { ModalStateEnum } from 'types/modal';
import { SortEnum } from 'types/request';

import { Table, TableActions } from 'components';
import { Column } from 'components/Table';

import Pagination from '../Pagination';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
  setModalState: Function;
};

const TableComponent: FC<ComponentProps> = (props) => {
  const { className, setModalState } = props;
  const { genres, modifyGenre } = useStore();

  const onClickEdit = useCallback(
    (e: any, id: number, cb: Function) => {
      cb(true);
      modifyGenre.getById({ id }, {}, (err: any) => {
        if (!err) {
          cb(false);
          setModalState({ id, type: ModalStateEnum.UPDATE, open: true });
        }
      });
    },
    [modifyGenre, setModalState]
  );

  const onClickDelete = useCallback(
    (e: any, id: number, cb: Function) => {
      cb(true);
      modifyGenre.getById({ id }, {}, (err: any) => {
        if (!err) {
          cb(false);
          setModalState({ id, type: ModalStateEnum.DELETE, open: true });
        }
      });
    },
    [modifyGenre, setModalState]
  );

  const columns = useMemo(() => {
    return [
      {
        key: 'id',
        title: 'Id',
        width: '10%',
        sort: genres.meta.field === 'id' ? genres.meta.sort : undefined,
      },
      {
        key: 'name',
        title: 'Name',
        width: '33%',
        sort: genres.meta.field === 'name' ? genres.meta.sort : undefined,
      },
      { key: 'actions', title: 'Actions', width: '33%', isSort: false },
    ];
  }, [genres.meta.field, genres.meta.sort]);

  const rows = useMemo(() => {
    return (
      genres.data?.data?.map((row) => ({
        id: row.id,
        name: row.name,
        actions: (
          <TableActions
            onClickEdit={(e: any, cb: Function) => onClickEdit(e, row.id, cb)}
            onClickDelete={(e: any, cb: Function) => onClickDelete(e, row.id, cb)}
          />
        ),
      })) || []
    );
  }, [genres.data?.data, onClickDelete, onClickEdit]);

  const onSortClick = (e: any, column: Column) => {
    genres.getAll(
      {
        field: column.key,
        sort: column.sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC,
        page: 0,
      },
      { silent: true }
    );
  };

  return (
    <div className={classNames(styles.genresTable, className)}>
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
