import React, { FC, useEffect } from 'react';
import classNames from 'classnames';

import { useMatch } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { CreatedSort, Tracks } from '..';
import { Pagination } from '..';

import { PendingWrapper } from 'components';
import { mainPageTrackLimit } from 'settings';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Content: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const match = useMatch({ path: routes.tracks });
    const category = match?.params.category;
    const genre = match?.params.genre;

    useEffect(() => {
        if ((category !== tracks.meta.category || genre !== tracks.meta.genre) && category && genre) {
            tracks.getAll({
                category,
                genre,
                visible: true,
                limit: mainPageTrackLimit,
            });
        }

        return () => tracks.resetStore();
    }, [category, genre, tracks]); // eslint-disable-line

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
