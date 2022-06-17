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
    const { genres } = useStore();

    const countPages = Math.ceil((genres.store.data?.count || 0) / genres.store.meta.limit);

    if (countPages <= 1) {
        return <div className={classNames(styles.pagination, className)} />;
    }

    const onClickPage = (e: any, page: number) => {
        genres.getAll({ page });
    };

    return (
        <div className={classNames(styles.pagination, className)}>
            <TablePagination
                count={genres.store.data?.count}
                current={genres.store.meta.page}
                limit={genres.store.meta.limit}
                onClickPage={onClickPage}
            />
        </div>
    );
};

export default observer(Pagination);
