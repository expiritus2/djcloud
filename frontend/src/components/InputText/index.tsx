import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    label?: string;
}

const InputText: FC<ComponentProps> = (props) => {
    const { className, label } = props;

    return (
        <div className={classNames(styles.inputText, className)}>
            <label className={styles.label}>{label}</label>
            <input className={styles.input} type="text" />
        </div>
    );
};

export default InputText;