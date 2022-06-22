import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    label?: string;
    onChange: any;
    checked: true | false;
    name: string;
};

const Checkbox: FC<ComponentProps> = (props) => {
    const { className, label, onChange, checked, name } = props;

    const onChangeHandler = (e: any) => {
        onChange({ target: { name, value: e.target.checked } });
    };

    return (
        <div className={classNames(styles.checkbox, className)}>
            <label className={styles.label}>
                <input
                    onChange={onChangeHandler}
                    className={styles.input}
                    type="checkbox"
                    checked={checked}
                    name={name}
                />
                <span className={styles.labelText}>{label}</span>
            </label>
        </div>
    );
};

export default Checkbox;
