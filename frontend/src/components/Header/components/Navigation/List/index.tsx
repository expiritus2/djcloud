import React, { FC, forwardRef } from 'react';
import classNames from 'classnames';

import { Category } from 'types/track';
import { NavLink, useLocation, useMatch } from 'react-router-dom';
import { link } from 'settings/navigation/link';
import { UserRoleEnum } from 'types/user';
import { useStore } from 'store';
import { routes } from 'settings/navigation/routes';

type ComponentProps = {
    className?: string;
    styles: { [key: string]: string };
    navCategories: Category[];
    onClickLink?: Function;
};

const List: FC<ComponentProps> = forwardRef<any, ComponentProps>((props, ref) => {
    const { className, styles, navCategories, onClickLink } = props;
    const { user, customerState } = useStore();
    const match = useMatch({ path: routes.tracks });
    const location = useLocation();

    const getLinkClassName = ({ isActive, index }: { isActive: boolean; index?: number }) => {
        const active = isActive || (location.pathname === '/' && index === 0);
        return classNames(styles.link, active ? styles.active : '');
    };

    const onClickAll = (e: any) => {
        onClickLink?.(e);
    };

    return (
        <ul ref={ref} className={classNames(styles.list, className)}>
            <li className={styles.item}>
                <NavLink
                    onClick={onClickAll}
                    className={({ isActive }) => {
                        return classNames(styles.link, isActive ? styles.active : '');
                    }}
                    to={routes.allTracks}
                >
                    All
                </NavLink>
            </li>
            {(navCategories || []).map((category: Category, index: number) => {
                return (
                    <li key={category.value} className={styles.item}>
                        <NavLink
                            onClick={(e) => onClickLink?.(e)}
                            className={({ isActive }) => {
                                return getLinkClassName({
                                    isActive: isActive || +match?.params.categoryId! === category.id,
                                    index,
                                });
                            }}
                            to={link.toAllCategoryTracks(category.id.toString())}
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
    );
});

export default List;
