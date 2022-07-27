import React, { FC, useEffect } from 'react';
import classNames from 'classnames';

import { useMatch, useLocation } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { CreatedSort, PopularSort, Tracks } from '..';
import { Pagination } from '..';

import { PendingWrapper } from 'components';
import { mainPageTrackLimit } from 'settings';

import styles from './styles.module.scss';
import { getQuery } from 'helpers/query';
import { GroupedTrackGenres } from '../../../../store/TrackGenres';

type ComponentProps = {
    className?: string;
};

const Content: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks, navCategories, tracksGenres } = useStore();
    const match = useMatch({ path: routes.tracks });
    const location = useLocation();
    const query = getQuery(location);

    useEffect(() => {
        const category = match?.params.category || navCategories.data?.data?.[0]?.value || '';
        const genre = match?.params.genre || (tracksGenres.data as GroupedTrackGenres)?.[category]?.[0].value;
        if ((category !== tracks.meta.category || genre !== tracks.meta.genre) && category && genre) {
            tracks.getAll({
                category,
                genre,
                visible: true,
                limit: mainPageTrackLimit,
                search: query.search as string,
            });
        }

        return () => tracks.resetStore();
    }, [
        tracks,
        query.search,
        match?.params.category,
        navCategories.data?.data,
        tracksGenres.data,
        match?.params.genre,
    ]);

    return (
        <div className={classNames(styles.content, className)}>
            <PendingWrapper state={tracks.state}>
                <>
                    <div className={styles.innerHolder}>
                        <div className={styles.sorts}>
                            <CreatedSort className={styles.createSort} />
                            <PopularSort className={styles.popularSort} />
                        </div>
                        <Tracks />
                    </div>
                    <Pagination />
                </>
            </PendingWrapper>
        </div>
    );
};

export default observer(Content);
