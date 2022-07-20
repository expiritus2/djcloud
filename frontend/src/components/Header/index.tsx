import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Search } from './components';
import { useNavigate } from 'react-router-dom';
import { LoginAvatar, Logo, Navigation } from './components';

import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Header: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { categories, tracksGenres } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (categories.data?.data) {
            for (const category of categories.data?.data || []) {
                tracksGenres.getTracksGenres({ category });
            }
        }
    }, [categories.data?.data]); // eslint-disable-line

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
