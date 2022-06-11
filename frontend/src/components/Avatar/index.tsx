import React, { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    src: string;
    onClick?: MouseEventHandler<HTMLElement>,
}

const Avatar: FC<ComponentProps> = (props) => {
    const { className, src, onClick } = props;

    return (
        <div onClick={onClick} className={classNames(styles.avatar, className)}>
            <img src={src} alt="" />
        </div>
    );
};

export default Avatar;
