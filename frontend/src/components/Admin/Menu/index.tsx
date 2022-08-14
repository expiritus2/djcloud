import React, { FC } from 'react';
import classNames from 'classnames';
import { Menu } from 'components';
import { routes } from 'settings/navigation/routes';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { AdminTabsEnum } from '../../../store/AdminState/types';

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
            path: routes.adminTracksList,
            label: 'Tracks',
            value: AdminTabsEnum.TRACKS,
            onClickItem,
        },
        {
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
