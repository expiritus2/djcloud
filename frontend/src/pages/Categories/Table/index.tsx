import React, { FC } from 'react';
import classNames from 'classnames';

import { TableActions, Table } from 'components';
import { useStore } from 'store';

import { observer } from 'mobx-react-lite';
import { ModalStateEnum } from 'types/modal';
import { SortEnum } from 'types/request';
import { Column } from 'components/Table';

import Pagination from '../Pagination';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    setModalState: Function;
};

const TableComponent: FC<ComponentProps> = (props) => {
    const { className, setModalState } = props;
    const { categories, modifyCategory } = useStore();

    const onClickEdit = (e: any, id: number, cb: Function) => {
        cb(true);
        modifyCategory.getById({ id }, {}, (err: any) => {
            if (!err) {
                cb(false);
                setModalState({ id, type: ModalStateEnum.UPDATE, open: true });
            }
        });
    };

    const onClickDelete = (e: any, id: number, cb: Function) => {
        cb(true);
        modifyCategory.getById({ id }, {}, (err: any) => {
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
                sort: categories.meta.field === 'id' ? categories.meta.sort : undefined,
            },
            {
                key: 'name',
                title: 'Name',
                width: '33%',
                sort: categories.meta.field === 'name' ? categories.meta.sort : undefined,
            },
            { key: 'actions', title: 'Actions', width: '33%', isSort: false },
        ];
    };

    const getRows = () => {
        return (
            categories.data?.data?.map((row) => ({
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
        categories.getAll(
            { field: column.key, sort: column.sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC, page: 0 },
            { silent: true },
        );
    };

    return (
        <div className={classNames(styles.categoriesTable, className)}>
            <Table columns={getColumns()} rows={getRows()} onSortClick={onSortClick} className={styles.table} />
            <Pagination />
        </div>
    );
};

export default observer(TableComponent);
