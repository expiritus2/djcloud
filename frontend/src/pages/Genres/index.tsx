import React, { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { getQuery } from 'helpers/query';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { ModalStateEnum } from 'types/modal';

import {
    AdminContentWrapper,
    AdminMenu,
    AdminPageTitle,
    Header,
    PageWrapper,
    PendingWrapper,
    TableWrapper,
} from 'components';

import GenreModal from './Modal';
import Table from './Table';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

export type InitModalStateType = { id?: string | undefined; type: ModalStateEnum | null; open: boolean };
export const initModalState: InitModalStateType = { id: undefined, type: null, open: false };

const Genres: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { genres } = useStore();
    const [modalState, setModalState] = useState(initModalState);
    const location = useLocation();
    const query = getQuery(location);

    useEffect(() => {
        genres.getAll({ search: query.search as string }, { silent: false });
    }, [query.search]); // eslint-disable-line

    const onClickNew = () => {
        setModalState({ type: ModalStateEnum.CREATE, open: true });
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
            <PageWrapper>
                <>
                    <AdminMenu />
                    <AdminContentWrapper>
                        <PendingWrapper state={genres.state} className={styles.pendingWrapper}>
                            <>
                                <AdminPageTitle title="Genres" onClickNew={onClickNew} />
                                <TableWrapper>
                                    <Table setModalState={setModalState} />
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
