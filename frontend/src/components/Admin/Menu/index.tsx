import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { NavLink } from 'react-router-dom';
import { routes } from '../../../settings/navigation/routes';

type ComponentProps = {
    className?: string;
};

const Menu: FC<ComponentProps> = (props) => {
    const { className } = props;

    const getLinkClassName = ({ isActive }: { isActive: boolean }) => classNames(styles.link, isActive ? styles.active : '');

    return (
        <div className={classNames(styles.menu, className)}>
            <ul className={styles.list}>
                <li className={styles.item}>
                    <NavLink className={getLinkClassName} to={routes.adminCategoriesList}>
                        Categories
                    </NavLink>
                </li>
                <li className={styles.item}>
                    <NavLink className={getLinkClassName} to={routes.adminGenresList}>
                        Genres
                    </NavLink>
                </li>
                <li className={styles.item}>
                    <NavLink className={getLinkClassName} to={routes.adminTracksList}>
                        Tracks
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Menu;
