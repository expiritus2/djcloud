import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { NavLink, useLocation, useMatch } from 'react-router-dom';
import { link } from 'settings/navigation/link';
import { UserRoleEnum } from 'types/user';
import { useStore } from 'store';
import { routes } from 'settings/navigation/routes';
import { observer } from 'mobx-react-lite';
import { Category } from 'types/track';
import { GroupedTrackGenres } from 'store/TrackGenres';

type ComponentProps = {
    className?: string;
};

const FullNav: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { user, navCategories, customerState, tracksGenres } = useStore();
    const match = useMatch({ path: routes.tracks });
    const location = useLocation();

    const getLinkClassName = ({ isActive, index }: { isActive: boolean; index?: number }) => {
        const active = isActive || (location.pathname === '/' && index === 0);
        return classNames(styles.link, active ? styles.active : '');
    };

    return (
        <div className={classNames(styles.fullNav, className)}>
            <ul className={styles.list}>
                {(navCategories.data?.data || []).map((category: Category, index: number) => {
                    return (
                        <li key={category.value} className={styles.item}>
                            <NavLink
                                className={({ isActive }) => {
                                    return getLinkClassName({
                                        isActive: isActive || +match?.params.categoryId! === category.id,
                                        index,
                                    });
                                }}
                                to={link.toTracks(
                                    category.id.toString(),
                                    customerState.tab[category.id.toString()] ||
                                        (tracksGenres.data as GroupedTrackGenres)?.[category.id]?.[0]?.id.toString(),
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

export default observer(FullNav);
