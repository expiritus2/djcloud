import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { NavLink } from 'react-router-dom';

export type MenuItem = {
    label: string;
    path: string;
    count?: number;
};

type ComponentProps = {
    className?: string;
    listItems: MenuItem[];
};

const Menu: FC<ComponentProps> = (props) => {
    const { className, listItems } = props;

    const getActiveClassName = ({ isActive }: { isActive: boolean }) =>
        classNames(styles.link, isActive ? styles.active : '');

    return (
        <div className={classNames(styles.menu, className)}>
            <ul className={styles.list}>
                {listItems.map((item) => (
                    <li key={item.path} className={styles.item}>
                        <NavLink className={getActiveClassName} to={item.path}>
                            <span>{item.label}</span>
                            {item.count && <span className={styles.count}>{`(${item.count})`}</span>}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Menu;
