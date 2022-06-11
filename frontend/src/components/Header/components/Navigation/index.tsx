import React, { FC } from 'react';
import classNames from 'classnames';

import { NavLink, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { UserRoleEnum } from 'types/user';
import { routes } from 'settings/navigation/routes';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
}

const Navigation: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { user } = useStore();
    const location = useLocation();

    const getLinkClassName = ({ isActive }: { isActive: boolean }) => classNames(styles.link, (isActive ? styles.active : ''))

    return (
        <div className={classNames(styles.navigation, className)}>
            <ul className={styles.list}>
                <li className={styles.item}>
                    <NavLink className={({ isActive }) => getLinkClassName({ isActive: isActive || location.pathname === '/' })} to={routes.mixs}>
                        Mix's
                    </NavLink>
                </li>
                <li className={styles.item}>
                    <NavLink className={getLinkClassName} to={routes.created}>
                        Created
                    </NavLink>
                </li>
                {user.data?.data?.role?.name === UserRoleEnum.ADMIN && <li className={styles.item}>
                    <NavLink className={getLinkClassName } to={routes.adminCategoriesList}>
                        Admin
                    </NavLink>
                </li>}
            </ul>
        </div>
    );
};

export default observer(Navigation)
;