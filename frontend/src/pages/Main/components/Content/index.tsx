import React, { FC, useEffect } from 'react';
import classNames from 'classnames';

import { useMatch, useLocation } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { CreatedSort, Tracks } from '..';
import { Pagination } from '..';

import { PendingWrapper } from 'components';
import { mainPageTrackLimit } from 'settings';

import styles from './styles.module.scss';
import { getQuery } from 'helpers/query';

type ComponentProps = {
    className?: string;
};

const Content: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const match = useMatch({ path: routes.tracks });
    const category = match?.params.category;
    const genre = match?.params.genre;
    const location = useLocation();
    const query = getQuery(location);

    useEffect(() => {
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
    }, [category, genre, tracks, query.search]); // eslint-disable-line

    return (
        <div className={classNames(styles.content, className)}>
            <PendingWrapper state={tracks.state}>
                <>
                    <div className={styles.innerHolder}>
                        <CreatedSort className={styles.createSort} />
                        <Tracks />
                    </div>
                    <Pagination />
                </>
            </PendingWrapper>
        </div>
    );
};

export default observer(Content);
