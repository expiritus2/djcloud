import React, { FC } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { useStore } from 'store';
import { SortEnum } from 'types/request';
import { mainPageTrackLimit } from 'settings';
import { BsSortDown, BsSortUp } from 'react-icons/bs';
import { SortFieldEnum } from '../SortField';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const SortAscDesc: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const isDesc = tracks.meta.sort === SortEnum.DESC;

    const onSort = () => {
        const newSort = tracks.meta.sort === SortEnum.DESC ? SortEnum.ASC : SortEnum.DESC;
        tracks.getAll({
            sort: newSort,
            field: tracks.meta.sort === undefined ? SortFieldEnum.CREATED_AT : tracks.meta.field,
            limit: mainPageTrackLimit,
            page: 0,
            shuffle: undefined,
        });
    };

    return (
        <div onClick={onSort} className={classNames(styles.sortAscDesc, className)}>
            <span className={styles.value}>{tracks.meta.sort || '---'}</span>
            {tracks.meta.sort &&
                (isDesc ? <BsSortDown className={styles.icon} /> : <BsSortUp className={styles.icon} />)}
        </div>
    );
};

export default observer(SortAscDesc);
