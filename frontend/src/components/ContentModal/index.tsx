import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { Button } from '../index';

export type ButtonType = {
    id: string;
    onClick: any;
    label: string;
    variant: 'primary' | 'secondary' | 'danger' | 'success';
    formId?: string;
    className?: string;
    pending?: boolean;
};

type ComponentProps = {
    className?: string;
    children: ReactNode;
    title: string;
    buttons: ButtonType[];
};

const Modal: FC<ComponentProps> = (props) => {
    const { className, children, title, buttons } = props;

    return (
        <div className={classNames(styles.modal, className)}>
            <div className={classNames(styles.meta, styles.header)}>{title}</div>
            {children}
            <div className={classNames(styles.meta, styles.footer)}>
                <div className={styles.buttons}>
                    {buttons.map((button) => (
                        <Button pending={button.pending} key={button.id} onClick={button.onClick} label={button.label} className={classNames(styles.button, button.className)} variant={button.variant} form={button.formId} />
                    ))}
                </div>
                <div className={styles.clear} />
            </div>
        </div>
    );
};

export default Modal;
