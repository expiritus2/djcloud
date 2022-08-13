import React, { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    onClick?: MouseEventHandler<HTMLElement>;
};

const Logo: FC<ComponentProps> = (props) => {
    const { className, onClick } = props;

    return (
        <div onClick={onClick} className={classNames(styles.logo, className)}>
            <img src="/images/logo.png" alt="Logo" className={styles.logoImage} />
        </div>
    );
};

export default Logo;
