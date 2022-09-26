import React, { FC } from 'react';
import classNames from 'classnames';
import { useScreen } from 'hooks';
import { observer } from 'mobx-react-lite';
import { mainPageMobileTrackLimit, mainPageTrackLimit } from 'settings';
import { useStore } from 'store';

import { TablePagination } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Pagination: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const { isMobile } = useScreen();

    const countPages = Math.ceil((tracks.data?.count || 0) / tracks.meta.limit || 0);

    if (countPages <= 1) {
        return <div className={classNames(styles.pagination, className)} />;
    }

    const onClickPage = (e: any, page: number) => {
        const sort = tracks.meta.sort ? { sort: tracks.meta.sort } : {};
        tracks.getAll({ page, limit: isMobile ? mainPageMobileTrackLimit : mainPageTrackLimit, ...sort });
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
