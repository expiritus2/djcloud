import React, { FC, useRef, useState } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { NavLink, useLocation, useMatch } from 'react-router-dom';
import { link } from 'settings/navigation/link';
import { UserRoleEnum } from 'types/user';
import { useStore } from 'store';
import { routes } from 'settings/navigation/routes';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useOutsideClick } from 'hooks';
import { observer } from 'mobx-react-lite';
import { Category } from 'types/track';
import { GroupedTrackGenres } from '../../../../../store/TrackGenres';

type ComponentProps = {
    className?: string;
};

const SmallNav: FC<ComponentProps> = (props) => {
    const { className } = props;
    const [open, setOpen] = useState(false);
    const { user, navCategories, customerState, tracksGenres } = useStore();
    const match = useMatch({ path: routes.tracks });
    const location = useLocation();
    const listRef = useRef(null);
    const hamburgerRef = useRef(null);

    useOutsideClick([listRef, hamburgerRef], () => setOpen(false));

    const getLinkClassName = ({ isActive, index }: { isActive: boolean; index?: number }) => {
        const active = isActive || (location.pathname === '/' && index === 0);
        return classNames(styles.link, active ? styles.active : '');
    };

    const onOpen = () => {
        setOpen(!open);
    };

    const onClickLink = () => {
        setOpen(false);
    };

    return (
        <div className={classNames(styles.smallNav, className)}>
            <div ref={hamburgerRef}>
                <GiHamburgerMenu onClick={onOpen} className={styles.hamburger} />
            </div>
            {open && (
                <ul ref={listRef} className={styles.list}>
                    {(navCategories.data?.data || []).map((category: Category, index: number) => {
                        return (
                            <li key={category.value} className={styles.item}>
                                <NavLink
                                    onClick={onClickLink}
                                    className={({ isActive }) => {
                                        return getLinkClassName({
                                            isActive: isActive || match?.params.category === category.value,
                                            index,
                                        });
                                    }}
                                    to={link.toTracks(
                                        category.value,
                                        customerState.tab[category.value] ||
                                            (tracksGenres.data as GroupedTrackGenres)?.[category.value]?.[0]?.value,
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
                                onClick={onClickLink}
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
            )}
        </div>
    );
};

export default observer(SmallNav);
