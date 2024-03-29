import React, { FC, useCallback } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import { TablePagination } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
  className?: string;
};

const Pagination: FC<ComponentProps> = (props) => {
  const { className } = props;
  const { tracks } = useStore();

  const countPages = Math.ceil((tracks.data?.count || 0) / tracks.meta.limit || 0);

  const onClickPage = useCallback(
    (e: any, page: number) => {
      tracks.getAll({ page });
    },
    [tracks]
  );

  if (countPages <= 1) {
    return <div className={classNames(styles.pagination, className)} />;
  }

  return (
    <div className={classNames(styles.pagination, className)}>
      <TablePagination
        count={tracks.data?.count}
        current={tracks.meta.page}
        limit={tracks.meta.limit}
        onClickPage={onClickPage}
      />
    </div>
  );
};

export default observer(Pagination);
