import React, { FC } from 'react';
import classNames from 'classnames';
import { Menu } from 'components';
import { routes } from 'settings/navigation/routes';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store';

type ComponentProps = {
    className?: string;
};

const AdminMenu: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { customerState } = useStore();

    const onClickItem = (e: any, tab: string) => {
        customerState.tab = { ...customerState.tab, admin: tab };
    };

    const menuItems = [
        {
            path: routes.adminCategoriesList,
            label: 'Categories',
            value: 'categories',
            onClickItem,
        },
        {
            path: routes.adminGenresList,
            label: 'Genres',
            value: 'genres',
            onClickItem,
        },
        {
            path: routes.adminTracksList,
            label: 'Tracks',
            value: 'tracks',
            onClickItem,
        },
    ];

    return <Menu listItems={menuItems} className={classNames(styles.adminMenu, className)} />;
};

export default observer(AdminMenu);
