import React, { FC, useEffect } from 'react';
import classNames from 'classnames';

import { NavLink, useMatch, useLocation } from 'react-router-dom';
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
    const { user, categories, genres } = useStore();
    const match = useMatch({ path: routes.tracks });
    const location = useLocation();

    useEffect(() => {
        categories.getAll({ limit: 5 });
        genres.getAll();
    }, []); // eslint-disable-line

    const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
        classNames(styles.link, isActive ? styles.active : '');

    return (
        <div className={classNames(styles.navigation, className)}>
            <ul className={styles.list}>
                {categories.store.data?.data.map((category) => (
                    <li key={category.value} className={styles.item}>
                        <NavLink
                            className={({ isActive }) =>
                                getLinkClassName({ isActive: isActive || match?.params.category === category.value })
                            }
                            to={link.toTracks(category.value, '')}
                        >
                            {category.name}
                        </NavLink>
                    </li>
                ))}
                {user.store?.data?.role?.name === UserRoleEnum.ADMIN && (
                    <li className={styles.item}>
                        <NavLink
                            className={({ isActive }) =>
                                getLinkClassName({ isActive: isActive || location.pathname.startsWith('/admin') })
                            }
                            to={routes.adminCategoriesList}
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
