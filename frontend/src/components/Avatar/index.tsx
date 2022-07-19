import React, { FC, MouseEventHandler, forwardRef } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    src: string;
    onClick?: MouseEventHandler<HTMLElement>;
    ref?: any;
};

const Avatar: FC<ComponentProps> = forwardRef<HTMLDivElement, ComponentProps>((props, ref) => {
    const { className, src, onClick } = props;

    return (
        <div ref={ref} onClick={onClick} className={classNames(styles.avatar, className)}>
            <img src={src} alt="" />
        </div>
    );
});

export default Avatar;
