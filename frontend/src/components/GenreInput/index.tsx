import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';

import { Category } from 'types/track';
import { cloneDeep } from 'lodash';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    name?: string;
    onChange: any;
    value: Category | null | undefined;
    label?: string;
    error?: string;
};

const GenreInput: FC<ComponentProps> = (props) => {
    const { className, name, onChange, value, label = 'Genre', error } = props;
    const { genres } = useStore();

    useEffect(() => {
        genres.getAll({ limit: undefined, page: undefined, sort: undefined, field: undefined, search: undefined });
    }, []); // eslint-disable-line

    const onChangeValue = (e: any) => {
        const genre = (genres.data?.data || []).find((cat) => cat.id === +e.target.value);
        onChange({ ...e, target: { name, value: cloneDeep(genre) || null } });
    };

    return (
        <div className={classNames(styles.genreInput, className)}>
            <label className={styles.label}>{label}</label>
            <select
                defaultValue={value?.id}
                name={name}
                className={styles.input}
                onChange={(e) => onChangeValue(e)}
                value={value?.id || ''}
            >
                <option value="null">---</option>
                {(genres.data?.data || []).map((genre) => (
                    <option key={genre.id} value={genre.id}>
                        {genre.name}
                    </option>
                ))}
            </select>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default observer(GenreInput);
