import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { AdminContentWrapper, AdminMenu, AdminPageTitle, AdminPageWrapper, Header, PendingWrapper, Table, TableActions } from 'components';
import { useStore } from 'store';

import { observer } from 'mobx-react-lite';
import CategoryModal from './Modal';
import { ModalStateEnum } from 'types/modal';
import { SortEnum } from 'types/request';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

export type InitModalStateType = { id?: number | undefined; type: ModalStateEnum | null; open: boolean };
export const initModalState: InitModalStateType = { id: undefined, type: null, open: false };

const Categories: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { categories, modifyCategory } = useStore();
    const [modalState, setModalState] = useState(initModalState);

    useEffect(() => {
        categories.getAll({ field: 'id', sort: SortEnum.ASC });
    }, []); // eslint-disable-line

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

    const onClickEdit = (e: any, id: number) => {
        modifyCategory.getById({ id }, {}, (err: any) => {
            if (!err) {
                setModalState({ id, type: ModalStateEnum.UPDATE, open: true });
            }
        });
    };

    const onClickDelete = (e: any, id: number) => {
        modifyCategory.getById({ id });
        setModalState({ id, type: ModalStateEnum.DELETE, open: true });
    };

    const getRows = () => {
        return (
            categories.store.data?.data?.map((row) => ({
                id: row.id,
                name: row.name,
                actions: <TableActions onClickEdit={(e: any) => onClickEdit(e, row.id)} onClickDelete={(e: any) => onClickDelete(e, row.id)} />,
            })) || []
        );
    };

    const getModalTitle = () => {
        if (modalState.type === ModalStateEnum.UPDATE) {
            return 'Update Category';
        }

        if (modalState.type === ModalStateEnum.DELETE) {
            return 'Delete Category';
        }

        return 'Create Category';
    };

    return (
        <div className={classNames(styles.categories, className)}>
            <Header />
            <AdminPageWrapper>
                <>
                    <AdminMenu />
                    <AdminContentWrapper>
                        <PendingWrapper state={categories.store.state} className={styles.pendingWrapper}>
                            <>
                                <AdminPageTitle title="Categories" onClickNew={onClickNew} />
                                <Table columns={getColumns()} rows={getRows()} />
                                <CategoryModal title={getModalTitle()} modalState={modalState} setModalState={setModalState} />
                            </>
                        </PendingWrapper>
                    </AdminContentWrapper>
                </>
            </AdminPageWrapper>
        </div>
    );
};

export default observer(Categories);
