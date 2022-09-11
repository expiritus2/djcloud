import React, { FC } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';

import { Menu } from 'components';

import { AdminTabsEnum } from '../../../store/AdminState/types';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const AdminMenu: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { adminState } = useStore();

    const onClickItem = (e: any, tab: AdminTabsEnum) => {
        adminState.tab = { ...adminState.tab, admin: tab };
    };

    const menuItems = [
        {
            id: 'tracksMenuItem',
            path: routes.adminTracksList,
            label: 'Tracks',
            value: AdminTabsEnum.TRACKS,
            onClickItem,
        },
        {
            id: 'categoriesMenuItem',
            path: routes.adminCategoriesList,
            label: 'Categories',
            value: AdminTabsEnum.CATEGORIES,
            onClickItem,
        },
        {
            id: 'genresMenuItem',
            path: routes.adminGenresList,
            label: 'Genres',
            value: AdminTabsEnum.GENRES,
            onClickItem,
        },
    ];

    return <Menu listItems={menuItems} className={classNames(styles.adminMenu, className)} />;
};

export default observer(AdminMenu);
