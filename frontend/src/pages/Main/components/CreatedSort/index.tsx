import React, { FC } from 'react';
import classNames from 'classnames';

import { BsSortUp, BsSortDown } from 'react-icons/bs';
import { useStore } from 'store';
import { SortEnum } from 'types/request';
import { mainPageTrackLimit } from 'settings';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const CreatedSort: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const isDesc = tracks.meta.sort === SortEnum.DESC;
    const isCreatedAtField = tracks.meta.field === 'createdAt';

    const onSort = () => {
        const newSort = tracks.meta.sort === SortEnum.DESC ? SortEnum.ASC : SortEnum.DESC;
        tracks.getAll({ sort: newSort, limit: mainPageTrackLimit, field: 'createdAt', page: 0 });
    };

    return (
        <div onClick={onSort} className={classNames(styles.createdSort, className)}>
            <span
                className={classNames({
                    [styles.active]: isCreatedAtField && tracks.meta.sort === SortEnum.DESC,
                })}
            >
                Newest
            </span>
            <span>/</span>
            <span
                className={classNames({
                    [styles.active]: isCreatedAtField && tracks.meta.sort === SortEnum.ASC,
                })}
            >
                Oldest
            </span>
            {isCreatedAtField && isDesc ? <BsSortDown className={styles.icon} /> : <BsSortUp className={styles.icon} />}
        </div>
    );
};

export default CreatedSort;
