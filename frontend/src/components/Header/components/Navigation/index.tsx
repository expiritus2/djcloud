import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { useScreen } from 'hooks';
import { observer } from 'mobx-react-lite';
import { MOBILE_SMALL } from 'settings/constants/screen';
import { useStore } from 'store';

import FullNav from './FullNav';
import SmallNav from './SmallNav';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Navigation: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { screen } = useScreen();
    const { navCategories, tracksGenres } = useStore();

    useEffect(() => {
        navCategories.getAll();
        tracksGenres.getTracksGenres();
    }, []); // eslint-disable-line

    return (
        <div className={classNames(styles.navigation, screen.width <= 900 ? styles.mobile : styles.desktop, className)}>
            {screen.width > MOBILE_SMALL ? <FullNav /> : <SmallNav />}
        </div>
    );
};

export default observer(Navigation);
