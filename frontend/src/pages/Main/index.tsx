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
    const { tracksGenres, categories, customerState } = useStore();
    const location = useLocation();
    const navigate = useNavigate();
    const match = useMatch({ path: routes.tracks });

    useEffect(() => {
        if (location.pathname === '/' && categories.data?.data[0] && tracksGenres.data?.[0]?.value) {
            const category = categories.data?.data[0].value;
            const genre = tracksGenres.data[0].value;
            customerState.setTab(genre, category);
            navigate(link.toTracks(category, genre));
        }

        customerState.setTab(match?.params.genre!, match?.params.category!);
    }, [location.pathname, match?.params.genre, match?.params.category]); // eslint-disable-line

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
