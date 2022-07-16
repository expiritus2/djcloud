import React, { FC } from 'react';
import classNames from 'classnames';

import { Spinner } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    label?: string;
    onChange: any;
    checked: true | false;
    name: string;
    pending?: boolean;
};

const Checkbox: FC<ComponentProps> = (props) => {
    const { className, label, onChange, checked, name, pending = false } = props;

    const onChangeHandler = (e: any) => {
        onChange({ target: { name, value: e.target.checked } });
    };

    return (
        <div className={classNames(styles.checkbox, className)}>
            <label className={styles.label}>
                {pending ? (
                    <Spinner loaderWrapperClassName={styles.loaderWrapper} className={styles.loader} />
                ) : (
                    <input
                        onChange={onChangeHandler}
                        className={styles.input}
                        type="checkbox"
                        checked={checked}
                        name={name}
                    />
                )}
                {label && <span className={styles.labelText}>{label}</span>}
            </label>
        </div>
    );
};

export default Checkbox;
