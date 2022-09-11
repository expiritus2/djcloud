import React, { FC } from 'react';
import { BsSortDown, BsSortUp } from 'react-icons/bs';
import { useMatch } from 'react-router-dom';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { mainPageTrackLimit } from 'settings';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { SortEnum } from 'types/request';

import { SortFieldEnum } from '../SortField';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const SortAscDesc: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const oneTrackMatch = useMatch({ path: routes.track });
    const isDesc = tracks.meta.sort === SortEnum.DESC;

    const onSort = () => {
        let paramsCategoryId = undefined;
        let paramsGenreId = undefined;
        if (oneTrackMatch) {
            const { categoryId, genreId } = oneTrackMatch.params;
            if (categoryId && genreId) {
                paramsCategoryId = +categoryId;
                paramsGenreId = +genreId;
            }
        }
        const newSort = tracks.meta.sort === SortEnum.DESC ? SortEnum.ASC : SortEnum.DESC;
        tracks.getAll({
            sort: newSort,
            field:
                tracks.meta.sort === undefined || oneTrackMatch?.params.trackId
                    ? SortFieldEnum.CREATED_AT
                    : tracks.meta.field,
            limit: mainPageTrackLimit,
            categoryId: paramsCategoryId || tracks.meta.categoryId,
            genreId: paramsGenreId || tracks.meta.genreId,
            page: 0,
            shuffle: undefined,
            visible: true,
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
