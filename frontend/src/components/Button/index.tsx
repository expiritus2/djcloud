import React, { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    type?: 'button' | 'submit';
    label: string;
    onClick?: MouseEventHandler<HTMLButtonElement>,
    variant?: 'primary' | 'secondary' | 'danger' | 'success',
    form?: string,
}

const Button: FC<ComponentProps> = (props) => {
    const { className, type = 'button', label, onClick, variant = 'primary' } = props;
    const { form } = props;

    return (
        <div className={classNames(styles.buttonHolder, className)}>
            <button
                className={classNames(styles.button, styles[variant])}
                onClick={onClick}
                type={type}
                form={form}
            >
                {label}
            </button>
        </div>
    );
};

export default Button;