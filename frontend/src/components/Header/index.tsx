import React, { FC } from 'react';
import classNames from 'classnames';
import { Search } from './components';
import { useNavigate } from 'react-router-dom';
import { LoginAvatar, Logo, Navigation } from './components';

import { routes } from 'settings/navigation/routes';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Header: FC<ComponentProps> = (props) => {
    const { className } = props;
    const navigate = useNavigate();

    const onLogoClick = () => {
        navigate(routes.index);
    };

    return (
        <div className={classNames(styles.header, className)}>
            <Logo onClick={onLogoClick} className={styles.logo} />
            <div className={styles.info}>
                <Navigation />
                <Search className={styles.search} />
                <LoginAvatar />
            </div>
        </div>
    );
};

export default Header;
