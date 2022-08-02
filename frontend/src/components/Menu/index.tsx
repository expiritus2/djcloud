import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';

import { useScreen, useOutsideClick } from 'hooks';
import styles from './styles.module.scss';

export type MenuItem = {
    id?: string;
    label: string;
    path: string;
    value?: string;
    count?: number;
    active?: boolean;
    onClickItem?: Function;
};

type ComponentProps = {
    className?: string;
    listItems: MenuItem[];
};

const Menu: FC<ComponentProps> = (props) => {
    const { className, listItems } = props;
    const { screen } = useScreen();
    const [open, setOpen] = useState(!screen.mobileSmallWidth);
    const menuRef = useRef(null);

    useEffect(() => {
        setOpen(!screen.mobileSmallWidth);
    }, [screen.mobileSmallWidth]);

    useOutsideClick([menuRef], () => setOpen(false));

    const getActiveClassName = ({ isActive }: { isActive: boolean }) => {
        return classNames(styles.link, isActive ? styles.active : '');
    };

    const renderItems = (list: MenuItem[]) => {
        return (list as MenuItem[]).map((item) => (
            <li key={item.path} className={styles.item}>
                <NavLink
                    id={item.id}
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

    const onClickMenu = () => {
        setOpen(true);
    };

    return (
        <div
            ref={menuRef}
            onClick={onClickMenu}
            className={classNames(styles.menu, open ? styles.open : styles.closed, className)}
        >
            {screen.mobileSmallWidth && <GiHamburgerMenu className={styles.openIcon} />}
            <ul className={styles.list}>{renderItems(listItems)}</ul>
        </div>
    );
};

export default Menu;
