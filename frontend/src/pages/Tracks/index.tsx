import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
    AdminContentWrapper,
    AdminMenu,
    AdminPageTitle,
    Header,
    PageWrapper,
    PendingWrapper,
    TableWrapper,
} from 'components';
import { useStore } from 'store';

import { observer } from 'mobx-react-lite';
import TrackModal from './components/Modal';
import { ModalStateEnum } from 'types/modal';
import { Table, TableHeaderActions } from './components';

import { useLocation } from 'react-router-dom';
import { getQuery } from 'helpers/query';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

export type InitModalStateType = { id?: number | undefined; type: ModalStateEnum | null; open: boolean };
export const initModalState: InitModalStateType = { id: undefined, type: null, open: false };

const Tracks: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const [modalState, setModalState] = useState(initModalState);
    const location = useLocation();
    const query = getQuery(location);

    useEffect(() => {
        tracks.getAll({ search: query.search as string, withStats: true }, { silent: false });

        return () => tracks.resetStore();
    }, [query.search]); // eslint-disable-line

    const onClickNew = () => {
        setModalState({ type: ModalStateEnum.CREATE, open: true });
    };

    const getModalTitle = () => {
        if (modalState.type === ModalStateEnum.UPDATE) {
            return 'Update Track';
        }

        if (modalState.type === ModalStateEnum.DELETE) {
            return 'Delete Track';
        }

        return 'Create Track';
    };

    return (
        <div className={classNames(styles.tracks, className)}>
            <Header />
            <PageWrapper>
                <>
                    <AdminMenu />
                    <AdminContentWrapper>
                        <>
                            <AdminPageTitle title="Tracks" onClickNew={onClickNew} />
                            <TableHeaderActions />
                            <PendingWrapper
                                state={tracks.state}
                                className={styles.pendingWrapper}
                                loaderClassName={styles.loader}
                            >
                                <>
                                    <TableWrapper>
                                        <Table setModalState={setModalState} />
                                    </TableWrapper>
                                    <TrackModal
                                        title={getModalTitle()}
                                        modalState={modalState}
                                        setModalState={setModalState}
                                    />
                                </>
                            </PendingWrapper>
                        </>
                    </AdminContentWrapper>
                </>
            </PageWrapper>
        </div>
    );
};

export default observer(Tracks);
