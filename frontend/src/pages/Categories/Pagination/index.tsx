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
  const { categories } = useStore();

  const countPages = Math.ceil((categories.data?.count || 0) / categories.meta.limit || 0);

  const onClickPage = useCallback(
    (e: any, page: number) => {
      categories.getAll({ page });
    },
    [categories]
  );

  if (countPages <= 1) {
    return <div className={classNames(styles.pagination, className)} />;
  }

  return (
    <div className={classNames(styles.pagination, className)}>
      <TablePagination
        count={categories.data?.count}
        current={categories.meta.page}
        limit={categories.meta.limit}
        onClickPage={onClickPage}
      />
    </div>
  );
};

export default observer(Pagination);
