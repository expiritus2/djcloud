import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Header, PageWrapper } from 'components';
import { MainMenu, Content } from './components';
import { useLocation, useMatch } from 'react-router-dom';
import { useStore } from 'store';

import { routes } from 'settings/navigation/routes';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { GroupedTrackGenres } from 'store/TrackGenres';

type ComponentProps = {
    className?: string;
};

const Main: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracksGenres, categories, customerState, navCategories } = useStore();
    const location = useLocation();
    const match = useMatch({ path: routes.tracks });

    useEffect(() => {
        if (location.pathname === '/' && navCategories.data?.data) {
            const category = navCategories.data.data?.[0]?.value;
            const genre = (tracksGenres.data as GroupedTrackGenres)?.[category]?.[0]?.value;
            customerState.setTab(genre, category);
        } else {
            customerState.setTab(match?.params.genre!, match?.params.category!);
        }
    }, [categories.data, tracksGenres.data]); // eslint-disable-line

    return (
        <div className={classNames(styles.main, className)}>
            <Header />
            <PageWrapper>
                <>
                    <MainMenu />
                    <Content />
                </>
            </PageWrapper>
        </div>
    );
};

export default observer(Main);
