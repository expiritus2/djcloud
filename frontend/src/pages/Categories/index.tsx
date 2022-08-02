import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
    AdminContentWrapper,
    AdminMenu,
    AdminPageTitle,
    PageWrapper,
    Header,
    PendingWrapper,
    TableWrapper,
} from 'components';
import { useStore } from 'store';

import { observer } from 'mobx-react-lite';
import { ModalStateEnum } from 'types/modal';
import { useLocation } from 'react-router-dom';
import { getQuery } from 'helpers/query';

import Table from './Table';
import CategoryModal from './Modal';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

export type InitModalStateType = { id?: number | undefined; type: ModalStateEnum | null; open: boolean };
export const initModalState: InitModalStateType = { id: undefined, type: null, open: false };

const Categories: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { categories } = useStore();
    const [modalState, setModalState] = useState(initModalState);
    const location = useLocation();
    const query = getQuery(location);

    useEffect(() => {
        categories.getAll({ search: query.search as string }, { silent: false });
    }, [query.search]); // eslint-disable-line

    const onClickNew = () => {
        setModalState({ type: ModalStateEnum.CREATE, open: true });
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
            <PageWrapper>
                <>
                    <AdminMenu />
                    <AdminContentWrapper>
                        <PendingWrapper state={categories.state} className={styles.pendingWrapper}>
                            <>
                                <AdminPageTitle title="Categories" onClickNew={onClickNew} />
                                <TableWrapper>
                                    <Table setModalState={setModalState} />
                                </TableWrapper>
                                <CategoryModal
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

export default observer(Categories);
