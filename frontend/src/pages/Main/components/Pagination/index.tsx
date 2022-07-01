import React, { FC } from 'react';
import classNames from 'classnames';
import { TablePagination } from 'components';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import styles from './styles.module.scss';
import { mainPageTrackLimit } from '../../../../settings';

type ComponentProps = {
    className?: string;
};

const Pagination: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();

    const countPages = Math.ceil((tracks.data?.count || 0) / tracks.meta.limit || 0);

    if (countPages <= 1) {
        return <div className={classNames(styles.pagination, className)} />;
    }

    const onClickPage = (e: any, page: number) => {
        tracks.getAll({ page, limit: mainPageTrackLimit });
    };

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
