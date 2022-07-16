import React, { FC, useEffect } from 'react';
import classNames from 'classnames';

import { NavLink, useLocation, useMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { UserRoleEnum } from 'types/user';
import { routes } from 'settings/navigation/routes';
import { link } from 'settings/navigation/link';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Navigation: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { user, categories, genres, customerState, tracksGenres } = useStore();
    const match = useMatch({ path: routes.tracks });
    const location = useLocation();

    useEffect(() => {
        categories.getAll({ limit: 5 });
        genres.getAll();
    }, []); // eslint-disable-line

    const getLinkClassName = ({ isActive, index }: { isActive: boolean; index?: number }) => {
        const active = isActive || (location.pathname === '/' && index === 0);
        return classNames(styles.link, active ? styles.active : '');
    };

    return (
        <div className={classNames(styles.navigation, className)}>
            <ul className={styles.list}>
                {(categories.data?.data || []).map((category, index) => {
                    return (
                        <li key={category.value} className={styles.item}>
                            <NavLink
                                className={({ isActive }) => {
                                    return getLinkClassName({
                                        isActive: isActive || match?.params.category === category.value,
                                        index,
                                    });
                                }}
                                to={link.toTracks(
                                    category.value,
                                    customerState.tab[category.value] ||
                                        tracksGenres.genres[category.value]?.[0]?.value,
                                )}
                            >
                                {category.name}
                            </NavLink>
                        </li>
                    );
                })}
                {user.data?.role?.name === UserRoleEnum.ADMIN && (
                    <li className={styles.item}>
                        <NavLink
                            className={({ isActive }) =>
                                getLinkClassName({ isActive: isActive || location.pathname.startsWith('/admin') })
                            }
                            to={link.toAdminPage(customerState.tab.admin)}
                        >
                            Admin
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default observer(Navigation);
