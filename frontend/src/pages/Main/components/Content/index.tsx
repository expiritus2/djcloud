import React, { FC, useEffect } from 'react';
import classNames from 'classnames';

import { useMatch } from 'react-router-dom';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';
import { CreatedSort, Tracks } from '..';
import { Pagination } from '..';

import { PendingWrapper } from 'components';
import styles from './styles.module.scss';
import { mainPageTrackLimit } from '../../../../settings';

type ComponentProps = {
    className?: string;
};

const Content: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const match = useMatch({ path: routes.tracks });
    const altMatch = useMatch({ path: routes.tracksCategory });
    const category = match?.params.category || altMatch?.params.category;
    const genre = match?.params.genre || altMatch?.params.genre;

    useEffect(() => {
        tracks.resetStore();
        if (category && genre) {
            tracks.getAll({ category, genre, visible: true, limit: mainPageTrackLimit });
        }
    }, [category, genre, tracks]);

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
