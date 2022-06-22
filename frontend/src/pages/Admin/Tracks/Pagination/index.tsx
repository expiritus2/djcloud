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
    const { tracks } = useStore();

    const countPages = Math.ceil((tracks.store.data?.count || 0) / tracks.store.meta.limit);

    console.log(countPages);
    if (countPages <= 1) {
        return <div className={classNames(styles.pagination, className)} />;
    }

    const onClickPage = (e: any, page: number) => {
        tracks.getAll({ page });
    };

    return (
        <div className={classNames(styles.pagination, className)}>
            <TablePagination
                count={tracks.store.data?.count}
                current={tracks.store.meta.page}
                limit={tracks.store.meta.limit}
                onClickPage={onClickPage}
            />
        </div>
    );
};

export default observer(Pagination);
