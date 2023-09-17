import React, { FC } from 'react';
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
    const { categories, modifyCategory } = useStore();

    const onClickEdit = (e: any, id: string, cb: Function) => {
        cb(true);
        modifyCategory.getById({ id }, {}, (err: any) => {
            if (!err) {
                cb(false);
                setModalState({ id, type: ModalStateEnum.UPDATE, open: true });
            }
        });
    };

    const onClickDelete = (e: any, id: string, cb: Function) => {
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
                width: '10%',
                sort: ['id', 'createdAt'].includes(categories.meta.field) ? categories.meta.sort : undefined,
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
        const field = column.key === 'id' || column.key === 'createdAt' ? 'createdAt' : column.key;
        categories.getAll(
            { field, sort: column.sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC, page: 0 },
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
