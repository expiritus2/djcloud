import React, { FC, useEffect } from 'react';
import classNames from 'classnames';

import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { Pagination, Shuffle, SortAscDesc, SortField, Tracks } from '..';
import { PendingWrapper, TotalDuration } from 'components';
import { mainPageTrackLimit } from 'settings';
import { getQuery } from 'helpers/query';
import { link } from 'settings/navigation/link';
import { getCategoryIdFromParams } from '../../helpers';
import { SortFieldEnum } from '../SortField';
import { SortEnum } from 'types/request';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Content: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks, navCategories, tracksGenres } = useStore();
    const match = useMatch({ path: routes.tracks });
    const altMatch = useMatch({ path: routes.categoryPage });
    const oneTrackMatch = useMatch({ path: routes.track });
    const navigate = useNavigate();
    const location = useLocation();
    const query = getQuery(location);

    useEffect(() => {
        return () => tracks.resetStore();
    }, []); // eslint-disable-line

    useEffect(() => {
        if (location.pathname === routes.allTracks || location.pathname === routes.index) {
            tracks.getAll({
                categoryId: undefined,
                genreId: undefined,
                visible: true,
                search: query.search as string,
                limit: mainPageTrackLimit,
                page: 0,
                field: SortFieldEnum.CREATED_AT,
                sort: SortEnum.DESC,
                shuffle: undefined,
            });
        } else if (oneTrackMatch?.params.trackId) {
            if (query.search) {
                const categoryId = oneTrackMatch?.params.categoryId;
                const genreId = oneTrackMatch?.params.genreId;
                if (categoryId && genreId) {
                    navigate(`${link.toTracks(categoryId, genreId)}?search=${query.search}`);
                }
            } else {
                tracks.getById({ id: +oneTrackMatch.params.trackId });
                tracks.setMeta({ sort: SortEnum.DESC });
            }
        } else {
            const categoryId = getCategoryIdFromParams(match, altMatch, navCategories);

            if (categoryId) {
                const genreId = match?.params.genreId;
                if (categoryId !== tracks.meta.categoryId || genreId !== tracks.meta.genreId) {
                    tracks.getAll({
                        categoryId: +categoryId,
                        genreId: genreId ? +genreId : undefined,
                        visible: true,
                        limit: mainPageTrackLimit,
                        search: query.search as string,
                        page: 0,
                        field: SortFieldEnum.CREATED_AT,
                        sort: SortEnum.DESC,
                        shuffle: undefined,
                    });
                }
            }
        }
        // eslint-disable-next-line
    }, [
        tracks,
        query.search,
        match?.params.categoryId,
        altMatch?.params.categoryId,
        navCategories.data?.data,
        tracksGenres.data,
        match?.params.genreId,
        location.pathname,
    ]);

    return (
        <div className={classNames(styles.content, className)}>
            <PendingWrapper state={tracks.state}>
                <>
                    <div className={styles.innerHolder}>
                        <div className={styles.sorts}>
                            <div className={styles.actions}>
                                <SortField />
                                <SortAscDesc className={styles.sortAscDesc} />
                                <Shuffle className={styles.shuffle} />
                            </div>
                            <TotalDuration className={styles.totalDuration} />
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
