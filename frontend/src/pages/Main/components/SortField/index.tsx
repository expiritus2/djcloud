import React, { FC, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { useStore } from 'store';
import { mainPageTrackLimit } from 'settings';
import { SortEnum } from 'types/request';
import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import { useMatch } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';

type ComponentProps = {
    className?: string;
};

export enum SortFieldEnum {
    CREATED_AT = 'createdAt',
    RATING = 'rating',
}

export const sortFieldLabelMap = {
    [SortFieldEnum.CREATED_AT]: 'Newest',
    [SortFieldEnum.RATING]: 'Rating',
};

const EMPTY_VALUE = '---';

const SortField: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const oneTrackMatch = useMatch({ path: routes.track });
    const [fieldValue, setFieldValue] = useState<SortFieldEnum | typeof EMPTY_VALUE>(
        !tracks.meta.shuffle ? SortFieldEnum.CREATED_AT : EMPTY_VALUE,
    );

    useEffect(() => {
        if (fieldValue !== tracks.meta.field) {
            setFieldValue(tracks.meta.field);
        }
    }, [tracks.meta.field]); // eslint-disable-line

    useEffect(() => {
        if (tracks.meta.shuffle) {
            setFieldValue(EMPTY_VALUE);
        }
    }, [tracks.meta.shuffle]);

    const fields = useMemo(() => {
        return [SortFieldEnum.RATING, SortFieldEnum.CREATED_AT];
    }, []);

    const onChange = (e: any) => {
        if (e.target.value !== EMPTY_VALUE) {
            let paramsCategoryId = undefined;
            let paramsGenreId = undefined;
            if (oneTrackMatch) {
                const { categoryId, genreId } = oneTrackMatch.params;
                if (categoryId && genreId) {
                    paramsCategoryId = +categoryId;
                    paramsGenreId = +genreId;
                }
            }
            tracks.getAll({
                field: e.target.value,
                sort: SortEnum.DESC,
                limit: mainPageTrackLimit,
                categoryId: paramsCategoryId || tracks.meta.categoryId,
                genreId: paramsGenreId || tracks.meta.genreId,
                page: 0,
                shuffle: undefined,
                visible: true,
            });
        }
        setFieldValue(e.target.value);
    };

    return (
        <div className={classNames(styles.sortField, className)}>
            <select value={fieldValue} onChange={onChange} className={styles.input}>
                {tracks.meta.shuffle && <option value={EMPTY_VALUE}>{EMPTY_VALUE}</option>}
                {fields.map((field) => (
                    <option key={field} value={field}>
                        {sortFieldLabelMap[field]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default observer(SortField);
