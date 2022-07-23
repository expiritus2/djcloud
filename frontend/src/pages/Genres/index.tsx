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
    TableWrapper,
} from 'components';
import { useStore } from 'store';
import Pagination from './Pagination';

import { observer } from 'mobx-react-lite';
import GenreModal from './Modal';
import { ModalStateEnum } from 'types/modal';
import { SortEnum } from 'types/request';
import { Column } from 'components/Table';

import styles from './styles.module.scss';
import { useLocation } from 'react-router-dom';
import { getQuery } from '../../helpers/query';

type ComponentProps = {
    className?: string;
};

export type InitModalStateType = { id?: number | undefined; type: ModalStateEnum | null; open: boolean };
export const initModalState: InitModalStateType = { id: undefined, type: null, open: false };

const Genres: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { genres, modifyGenre } = useStore();
    const [modalState, setModalState] = useState(initModalState);
    const location = useLocation();
    const query = getQuery(location);

    useEffect(() => {
        genres.getAll({ search: query.search as string }, { silent: false });
    }, [query.search]); // eslint-disable-line

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

    const onClickNew = () => {
        setModalState({ type: ModalStateEnum.CREATE, open: true });
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

    const getModalTitle = () => {
        if (modalState.type === ModalStateEnum.UPDATE) {
            return 'Update Genre';
        }

        if (modalState.type === ModalStateEnum.DELETE) {
            return 'Delete Genre';
        }

        return 'Create Genre';
    };

    const onSortClick = (e: any, column: Column) => {
        genres.getAll(
            { field: column.key, sort: column.sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC, page: 0 },
            { silent: true },
        );
    };

    return (
        <div className={classNames(styles.genres, className)}>
            <Header />
            <PageWrapper>
                <>
                    <AdminMenu />
                    <AdminContentWrapper>
                        <PendingWrapper state={genres.state} className={styles.pendingWrapper}>
                            <>
                                <AdminPageTitle title="Genres" onClickNew={onClickNew} />
                                <TableWrapper>
                                    <Table
                                        columns={getColumns()}
                                        rows={getRows()}
                                        onSortClick={onSortClick}
                                        className={styles.table}
                                    />
                                    <Pagination />
                                </TableWrapper>
                                <GenreModal
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

export default observer(Genres);
