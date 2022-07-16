import React, { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { sign } from 'settings/sign';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    onClick?: MouseEventHandler<HTMLElement>;
};

const Logo: FC<ComponentProps> = (props) => {
    const { className, onClick } = props;

    return (
        <div onClick={onClick} className={classNames(styles.logo, className)}>
            {sign}
        </div>
    );
};

export default Logo;
