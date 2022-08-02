import React, { FC } from 'react';
import classNames from 'classnames';

import { useStore } from 'store';
import { SortEnum } from 'types/request';
import { Column } from 'components/Table';
import { observer } from 'mobx-react-lite';
import { ModalStateEnum } from 'types/modal';
import { Table, TableActions } from 'components';

import Pagination from '../Pagination';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    setModalState: Function;
};

const TableComponent: FC<ComponentProps> = (props) => {
    const { className, setModalState } = props;
    const { genres, modifyGenre } = useStore();

    const onClickEdit = (e: any, id: number, cb: Function) => {
        cb(true);
        modifyGenre.getById({ id }, {}, (err: any) => {
            if (!err) {
                cb(false);
                setModalState({ id, type: ModalStateEnum.UPDATE, open: true });
            }
        });
    };

    const onClickDelete = (e: any, id: number, cb: Function) => {
        cb(true);
        modifyGenre.getById({ id }, {}, (err: any) => {
            if (!err) {
                cb(false);
                setModalState({ id, type: ModalStateEnum.DELETE, open: true });
            }
        });
    };

    const getColumns = () => {
        return [
            {
                key: 'id',
                title: 'Id',
                width: '33%',
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
    };

    const getRows = () => {
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
    };

    const onSortClick = (e: any, column: Column) => {
        genres.getAll(
            { field: column.key, sort: column.sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC, page: 0 },
            { silent: true },
        );
    };

    return (
        <div className={classNames(styles.genresTable, className)}>
            <Table columns={getColumns()} rows={getRows()} onSortClick={onSortClick} className={styles.table} />
            <Pagination />
        </div>
    );
};

export default observer(TableComponent);
