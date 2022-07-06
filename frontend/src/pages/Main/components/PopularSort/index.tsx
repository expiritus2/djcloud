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

const PopularSort: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const isDesc = tracks.meta.sort === SortEnum.DESC;
    const isRatingField = tracks.meta.field === 'rating';

    const onSort = () => {
        const newSort = tracks.meta.sort === SortEnum.DESC ? SortEnum.ASC : SortEnum.DESC;
        tracks.getAll({ sort: newSort, limit: mainPageTrackLimit, field: 'rating' });
    };

    return (
        <div onClick={onSort} className={classNames(styles.createdSort, className)}>
            <span
                className={classNames({
                    [styles.active]: isRatingField,
                })}
            >
                Popular
            </span>
            {isRatingField && isDesc ? <BsSortDown className={styles.icon} /> : <BsSortUp className={styles.icon} />}
        </div>
    );
};

export default PopularSort;
