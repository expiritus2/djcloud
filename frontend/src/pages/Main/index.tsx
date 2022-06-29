import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import { Header, PageWrapper } from 'components';
import { MainMenu, Content } from './components';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { useStore } from 'store';

import { link } from 'settings/navigation/link';
import { routes } from 'settings/navigation/routes';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

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
        if (location.pathname === '/' && categories.data?.data[0] && tracksGenres.data?.[0]?.value) {
            navigate(link.toTracks(categories.data?.data[0].value, tracksGenres.data[0].value));
        }

        if (!match && altMatch?.params.category && tracksGenres.data) {
            navigate(link.toTracks(altMatch.params.category, tracksGenres.data[0].value));
        }
    }, [location.pathname, categories.data, navigate, tracksGenres.data, match, altMatch?.params.category]);

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
