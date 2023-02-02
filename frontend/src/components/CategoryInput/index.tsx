import React, { FC, MouseEventHandler, useEffect } from 'react';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { Category } from 'types/track';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    name?: string;
    onChange: MouseEventHandler<HTMLSelectElement>;
    value: Category | null | undefined;
    label?: string;
    error?: string;
};

const CategoryInput: FC<ComponentProps> = (props) => {
    const { className, name, onChange, value, label = 'Category', error } = props;
    const { categories } = useStore();

    useEffect(() => {
        categories.getAll({ limit: undefined, page: undefined, sort: undefined, field: undefined, search: undefined });
    }, []); // eslint-disable-line

    const onChangeValue = (e: any) => {
        const category = (categories.data?.data || []).find((cat) => cat.id === +e.target.value);
        onChange({ ...e, target: { name, value: cloneDeep(category) || null } });
    };

    return (
        <div className={classNames(styles.categoryInput, className)}>
            <label className={styles.label}>{label}</label>
            <select name={name} className={styles.input} onChange={(e) => onChangeValue(e)} value={value?.id || ''}>
                <option value="null">---</option>
                {(categories.data?.data || []).map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default observer(CategoryInput);
