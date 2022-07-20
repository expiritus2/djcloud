import React, { FC, useEffect } from 'react';
import classNames from 'classnames';

import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { useScreen } from 'hooks';
import FullNav from './FullNav';

import styles from './styles.module.scss';
import SmallNav from './SmallNav';
import { MOBILE_SMALL } from '../../../../settings/constants/screen';

type ComponentProps = {
    className?: string;
};

const Navigation: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { screen } = useScreen();
    const { categories, genres } = useStore();

    useEffect(() => {
        categories.getAll({ limit: 5 });
        genres.getAll();
    }, []); // eslint-disable-line

    return (
        <div className={classNames(styles.navigation, screen.width <= 900 ? styles.mobile : styles.desktop, className)}>
            {screen.width > MOBILE_SMALL ? <FullNav /> : <SmallNav />}
        </div>
    );
};

export default observer(Navigation);
