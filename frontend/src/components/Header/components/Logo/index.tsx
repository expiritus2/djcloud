import React, { FC, MouseEventHandler } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    onClick?: MouseEventHandler<HTMLElement>;
};

const Logo: FC<ComponentProps> = (props) => {
    const { className, onClick } = props;

    return (
        <div onClick={onClick} className={classNames(styles.logo, className)}>
            <Link to={routes.index} className={styles.link}>
                <img src="/images/logo.png" alt="Logo" className={styles.logoImage} />
            </Link>
        </div>
    );
};

export default Logo;
