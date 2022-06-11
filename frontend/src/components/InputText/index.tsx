import React, { ChangeEventHandler, FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    label?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    value: string;
    name: string;
    type?: 'text' | 'password';
};

const InputText: FC<ComponentProps> = (props) => {
    const { className, label, onChange, value, name, type = 'text' } = props;

    return (
        <div className={classNames(styles.inputText, className)}>
            <label className={styles.label}>{label}</label>
            <input onChange={onChange} className={styles.input} type={type} value={value} name={name} />
        </div>
    );
};

export default InputText;
