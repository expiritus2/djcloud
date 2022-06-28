import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Header, PageWrapper } from 'components';
import { MainMenu, Content } from './components';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { useStore } from 'store';

import { link } from 'settings/navigation/link';
import { routes } from 'settings/navigation/routes';
import { Player } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Main: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracksGenres, categories } = useStore();
    const location = useLocation();
    const navigate = useNavigate();
    const match = useMatch({ path: routes.tracks });
    const altMatch = useMatch({ path: routes.tracksCategory });

    useEffect(() => {
        if (location.pathname === '/' && categories.store.data?.data[0] && tracksGenres.store.data) {
            navigate(link.toTracks(categories.store.data?.data[0].value, tracksGenres.store.data[0].value));
        }

        if (!match && altMatch?.params.category && tracksGenres.store.data) {
            navigate(link.toTracks(altMatch.params.category, tracksGenres.store.data[0].value));
        }
    }, [
        location.pathname,
        categories.store.data?.data,
        navigate,
        tracksGenres.store.data,
        match,
        altMatch?.params.category,
    ]);

    return (
        <div className={classNames(styles.main, className)}>
            <Header />
            <PageWrapper className={styles.pageWrapper}>
                <>
                    <MainMenu />
                    <Content />
                </>
            </PageWrapper>
            <Player />
        </div>
    );
};

export default Main;
