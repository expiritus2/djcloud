import React, { FC } from 'react';
import { BsShuffle } from 'react-icons/bs';
import { useMatch } from 'react-router-dom';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Shuffle: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const oneTrackMatch = useMatch({ path: routes.track });
    const isShuffleField = tracks.meta.shuffle === true;

    const onShuffle = () => {
        let paramsCategoryId = undefined;
        let paramsGenreId = undefined;
        if (oneTrackMatch) {
            const { categoryId, genreId } = oneTrackMatch.params;
            if (categoryId && genreId) {
                paramsCategoryId = +categoryId;
                paramsGenreId = +genreId;
            }
        }
        tracks.getAll({
            limit: 100,
            shuffle: true,
            page: 0,
            categoryId: paramsCategoryId || tracks.meta.categoryId,
            genreId: paramsGenreId || tracks.meta.genreId,
            field: undefined,
            sort: undefined,
        });
    };

    return (
        <div onClick={onShuffle} className={classNames(styles.shuffle, { [styles.active]: isShuffleField }, className)}>
            <span>Shuffle</span>
            <BsShuffle className={styles.icon} />
        </div>
    );
};

export default observer(Shuffle);
