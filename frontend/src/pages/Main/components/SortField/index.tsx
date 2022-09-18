import React, { FC, useEffect, useState } from 'react';
import { useMatch } from 'react-router-dom';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { mainPageTrackLimit } from 'settings';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { SortEnum } from 'types/request';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

export enum SortFieldEnum {
    CREATED_AT = 'createdAt',
    RATING = 'rating',
    MOST_LISTEN = 'listenCount',
    DURATION = 'duration',
}

export const sortFields = [
    { label: 'Newest', value: SortFieldEnum.CREATED_AT },
    { label: 'Rating', value: SortFieldEnum.RATING },
    { label: 'Most listened', value: SortFieldEnum.MOST_LISTEN },
    { label: 'Duration', value: SortFieldEnum.DURATION },
];

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
                {sortFields.map((field) => (
                    <option key={field.value} value={field.value}>
                        {field.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default observer(SortField);
