import React, { FC, Fragment, ReactNode } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { NavLink } from 'react-router-dom';
import { DateFormat, formatDate } from '../../helpers/formatters';

export type MenuItem = {
    label: string;
    path: string;
    value?: string;
    count?: number;
    active?: boolean;
    onClickItem?: Function;
};

export type NestedMenuItem = {
    [key: string]: MenuItem[];
};

type ComponentProps = {
    className?: string;
    listItems: MenuItem[] | NestedMenuItem;
    switcher?: ReactNode;
};

const Menu: FC<ComponentProps> = (props) => {
    const { className, listItems, switcher } = props;

    const getActiveClassName = ({ isActive }: { isActive: boolean }) => {
        return classNames(styles.link, isActive ? styles.active : '');
    };

    const renderItems = (list: MenuItem[] | NestedMenuItem) => {
        if (!Array.isArray(list) && Object.keys(list).length) {
            return Object.entries(list).map(([key, val]) => (
                <Fragment key={key}>
                    <li className={styles.item}>{formatDate(new Date(key).toISOString(), DateFormat.dd_MMMM_yyyy)}</li>
                    <li className={styles.item}>
                        <ul className={styles.list}>{renderItems(val as MenuItem[])}</ul>
                    </li>
                </Fragment>
            ));
        }
        return (list as MenuItem[]).map((item) => (
            <li key={item.path} className={styles.item}>
                <NavLink
                    className={({ isActive }) => getActiveClassName({ isActive: item.active || isActive })}
                    to={item.path}
                    onClick={(e) => item.onClickItem?.(e, item.value)}
                >
                    <span className={styles.label}>{item.label}</span>
                    {item.count && <span className={styles.count}>{`(${item.count})`}</span>}
                </NavLink>
            </li>
        ));
    };

    return (
        <div className={classNames(styles.menu, className)}>
            {switcher}
            <ul className={styles.list}>{renderItems(listItems)}</ul>
        </div>
    );
};

export default Menu;
