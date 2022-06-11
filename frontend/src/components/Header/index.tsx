import React, { FC } from 'react';
import classNames from 'classnames';
import { Avatar, Search } from 'components';
import { useNavigate } from 'react-router-dom';
import { Logo, Navigation } from './components';

import styles from './styles.module.scss';
import { routes } from '../../settings/navigation/routes';

type ComponentProps = {
    className?: string;
};

const Header: FC<ComponentProps> = (props) => {
    const { className } = props;
    const navigate = useNavigate();

    const onClickLogin = () => {
        navigate(routes.login);
    };

    const onLogoClick = () => {
        navigate(routes.index);
    };

    return (
        <div className={classNames(styles.header, className)}>
            <Logo onClick={onLogoClick} className={styles.logo} />
            <div className={styles.info}>
                <Navigation />
                <Search className={styles.search} />
                <Avatar src="/images/default_avatar.png" className={styles.avatar} onClick={onClickLogin} />
            </div>
        </div>
    );
};

export default Header;
