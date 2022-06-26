import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';

import styles from './styles.module.scss';
import { Category } from '../../store/Tracks/types';
import { cloneDeep } from 'lodash';

type ComponentProps = {
    className?: string;
    name: string;
    onChange: any;
    value: Category | null;
    label?: string;
};

const GenreInput: FC<ComponentProps> = (props) => {
    const { className, name, onChange, value, label = 'Genre' } = props;
    const { genres } = useStore();

    useEffect(() => {
        genres.getAll({ limit: undefined, page: undefined, sort: undefined, field: undefined, search: undefined });
    }, []); // eslint-disable-line

    const onChangeValue = (e: any) => {
        const genre = (genres.store.data?.data || []).find((cat) => cat.value === e.target.value);
        onChange({ ...e, target: { name, value: cloneDeep(genre) || null } });
    };

    return (
        <div className={classNames(styles.genreInput, className)}>
            <label className={styles.label}>{label}</label>
            <select
                defaultValue={value?.value}
                name={name}
                className={styles.input}
                onChange={(e) => onChangeValue(e)}
                value={value?.value}
            >
                <option value="null">---</option>
                {(genres.store.data?.data || []).map((genre) => (
                    <option key={genre.id} value={genre.value}>
                        {genre.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default observer(GenreInput);
