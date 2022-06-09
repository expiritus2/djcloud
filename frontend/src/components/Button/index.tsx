import React, { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    type?: 'button' | 'submit';
    label: string;
    onClick?: MouseEventHandler<HTMLElement>,
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
}

const Button: FC<ComponentProps> = (props) => {
    const { className, type = 'button', label, onClick, variant = 'primary' } = props;

    return (
        <div className={classNames(styles.buttonHolder, className)}>
            <button className={classNames(styles.button, styles[variant])} onClick={onClick} type={type}>{label}</button>
        </div>
    );
};

export default Button;