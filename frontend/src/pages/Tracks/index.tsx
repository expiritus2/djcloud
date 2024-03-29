import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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

import { Track } from '../../types/track';

import TrackModal from './components/Modal';
import { Table, TableHeaderActions } from './components';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
};

export type InitModalStateType = {
  id?: number | undefined;
  type: ModalStateEnum | null;
  open: boolean;
  data?: Track;
};
export const initModalState: InitModalStateType = {
  id: undefined,
  type: null,
  open: false,
  data: undefined,
};

const Tracks: FC<ComponentProps> = (props) => {
  const { className } = props;
  const { tracks } = useStore();
  const [modalState, setModalState] = useState(initModalState);
  const location = useLocation();
  const query = getQuery(location);

  useEffect(() => {
    tracks.getAll({ search: query.search as string, withStats: true }, { silent: false });
  }, [query.search]); // eslint-disable-line

  useEffect(() => {
    return () => tracks.resetStore();
  }, []); // eslint-disable-line

  const onClickNew = useCallback(() => {
    setModalState({ type: ModalStateEnum.CREATE, open: true });
  }, []);

  const modalTitle = useMemo(() => {
    if (modalState.type === ModalStateEnum.UPDATE) {
      return 'Update Track';
    }

    if (modalState.type === ModalStateEnum.DELETE) {
      return 'Delete Track';
    }

    if (modalState.type === ModalStateEnum.ARCHIVE) {
      return tracks.meta.archive ? 'Unarchive Track' : 'Archive Track';
    }

    return 'Create Track';
  }, [modalState.type, tracks.meta.archive]);

  return (
    <div className={classNames(styles.tracks, className)}>
      <Header />
      <PageWrapper>
        <>
          <AdminMenu />
          <AdminContentWrapper>
            <>
              <AdminPageTitle
                title="Tracks"
                onClickNew={onClickNew}
              />
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
                    title={modalTitle}
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
