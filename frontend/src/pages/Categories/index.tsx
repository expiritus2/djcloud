import React, { FC, useEffect, useMemo, useState } from 'react';
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

import CategoryModal from './Modal';
import Table from './Table';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
};

export type InitModalStateType = {
  id?: number | undefined;
  type: ModalStateEnum | null;
  open: boolean;
};
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

  const modalTitle = useMemo(() => {
    if (modalState.type === ModalStateEnum.UPDATE) {
      return 'Update Category';
    }

    if (modalState.type === ModalStateEnum.DELETE) {
      return 'Delete Category';
    }

    return 'Create Category';
  }, [modalState.type]);

  return (
    <div className={classNames(styles.categories, className)}>
      <Header />
      <PageWrapper>
        <>
          <AdminMenu />
          <AdminContentWrapper>
            <PendingWrapper
              state={categories.state}
              className={styles.pendingWrapper}
            >
              <>
                <AdminPageTitle
                  title="Categories"
                  onClickNew={onClickNew}
                />
                <TableWrapper>
                  <Table setModalState={setModalState} />
                </TableWrapper>
                <CategoryModal
                  title={modalTitle}
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
