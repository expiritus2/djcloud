import React, { FC } from 'react';
import classNames from 'classnames';
import { Menu } from 'components';
import { routes } from 'settings/navigation/routes';
import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const AdminMenu: FC<ComponentProps> = (props) => {
    const { className } = props;

    const menuItems = [
        { path: routes.adminCategoriesList, label: 'Categories' },
        { path: routes.adminGenresList, label: 'Genres' },
        { path: routes.adminTracksList, label: 'Tracks' },
    ];

    return <Menu listItems={menuItems} className={classNames(styles.adminMenu, className)} />;
};

export default AdminMenu;
