import React, { FC } from 'react';
import classNames from 'classnames';
import { TablePagination } from 'components';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Pagination: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { categories } = useStore();

    const countPages = Math.ceil((categories.store.data?.count || 0) / categories.store.meta.limit);

    if (countPages <= 1) {
        return <div className={classNames(styles.pagination, className)} />;
    }

    const onClickPage = (e: any, page: number) => {
        categories.getAll({ page });
    };

    return (
        <div className={classNames(styles.pagination, className)}>
            <TablePagination
                count={categories.store.data?.count}
                current={categories.store.meta.page}
                limit={categories.store.meta.limit}
                onClickPage={onClickPage}
            />
        </div>
    );
};

export default observer(Pagination);
