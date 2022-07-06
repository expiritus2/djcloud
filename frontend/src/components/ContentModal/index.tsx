import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

import styles from './styles.module.scss';
import { Button } from '../index';

export type ButtonType = {
    id: string;
    onClick: any;
    label: string;
    variant: 'primary' | 'secondary' | 'danger' | 'success';
    type?: 'submit' | 'button';
    formId?: string;
    className?: string;
    pending?: boolean;
};

type ComponentProps = {
    className?: string;
    opacityLayerClassName?: string;
    wrapperClassName?: string;
    children: ReactNode;
    title: string;
    buttons: ButtonType[];
    open: boolean;
};

const Modal: FC<ComponentProps> = (props) => {
    const { className, children, title, buttons, opacityLayerClassName, wrapperClassName, open = false } = props;

    if (!open) return null;

    return createPortal(
        <div className={classNames(styles.wrapper, wrapperClassName)}>
            <div className={classNames(styles.opacityLayer, opacityLayerClassName)} />
            <div className={classNames(styles.modal, className)}>
                <div className={classNames(styles.meta, styles.header)}>{title}</div>
                {children}
                <div className={classNames(styles.meta, styles.footer)}>
                    <div className={styles.buttons}>
                        {buttons.map((button) => (
                            <Button
                                type={button.type}
                                pending={button.pending}
                                key={button.id}
                                onClick={button.onClick}
                                label={button.label}
                                className={classNames(styles.button, button.className)}
                                variant={button.variant}
                                form={button.formId}
                            />
                        ))}
                    </div>
                    <div className={styles.clear} />
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
