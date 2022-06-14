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

import { observer } from 'mobx-react-lite';
import GenreModal from './Modal';
import { ModalStateEnum } from 'types/modal';
import { SortEnum } from 'types/request';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

export type InitModalStateType = { id?: number | undefined; type: ModalStateEnum | null; open: boolean };
export const initModalState: InitModalStateType = { id: undefined, type: null, open: false };

const Genres: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { genres, modifyGenre } = useStore();
    const [modalState, setModalState] = useState(initModalState);

    useEffect(() => {
        genres.getAll({ field: 'id', sort: SortEnum.ASC });
    }, []); // eslint-disable-line

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
            { key: 'id', title: 'Id', width: '33%' },
            { key: 'name', title: 'Name', width: '33%' },
            { key: 'actions', title: 'Actions', width: '33%' },
        ];
    };

    const getRows = () => {
        return (
            genres.store.data?.data?.map((row) => ({
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

    return (
        <div className={classNames(styles.genres, className)}>
            <Header />
            <AdminPageWrapper>
                <>
                    <AdminMenu />
                    <AdminContentWrapper>
                        <PendingWrapper state={genres.store.state} className={styles.pendingWrapper}>
                            <>
                                <AdminPageTitle title="Genres" onClickNew={onClickNew} />
                                <Table columns={getColumns()} rows={getRows()} />
                                <GenreModal
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

export default observer(Genres);
