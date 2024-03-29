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
  const { genres } = useStore();

  const countPages = Math.ceil((genres.data?.count || 0) / genres.meta.limit || 0);

  const onClickPage = useCallback(
    (e: any, page: number) => {
      genres.getAll({ page });
    },
    [genres]
  );

  if (countPages <= 1) {
    return <div className={classNames(styles.pagination, className)} />;
  }

  return (
    <div className={classNames(styles.pagination, className)}>
      <TablePagination
        count={genres.data?.count}
        current={genres.meta.page}
        limit={genres.meta.limit}
        onClickPage={onClickPage}
      />
    </div>
  );
};

export default observer(Pagination);
