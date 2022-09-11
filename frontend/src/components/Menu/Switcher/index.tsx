import React, { FC } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { link } from 'settings/navigation/link';
import { routes } from 'settings/navigation/routes';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Switcher: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracksGenres, navCategories } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const match = useMatch({ path: routes.tracks });
    const oneTrackMatch = useMatch({ path: routes.track });
    const altMatch = useMatch({ path: routes.categoryPage });
    const categoryId = match?.params.categoryId || altMatch?.params.categoryId || oneTrackMatch?.params.categoryId;

    const onClickAll = () => {
        if (location.pathname === routes.index) {
            const firstCategoryId = navCategories.data?.data[0].id;
            if (firstCategoryId) {
                navigate(link.toAllCategoryTracks(firstCategoryId.toString()));
            }
        } else {
            navigate(link.toAllCategoryTracks(categoryId));
        }
    };

    const onClickGenres = () => {
        if (location.pathname === routes.index) {
            const firstCategoryId = navCategories.data?.data[0].id;
            if (firstCategoryId) {
                const genreId = tracksGenres.data?.[+firstCategoryId]?.[0]?.id;
                if (genreId) {
                    navigate(link.toTracks(firstCategoryId.toString(), genreId.toString()));
                }
            }
        } else {
            if (categoryId) {
                const genreId = tracksGenres.data?.[+categoryId]?.[0]?.id;
                if (genreId) {
                    navigate(link.toTracks(categoryId!, genreId.toString()));
                }
            }
        }
    };

    return (
        <div className={classNames(styles.switcher, className)}>
            <div
                onClick={onClickAll}
                className={classNames(
                    styles.tab,
                    styles.all,
                    altMatch?.params.categoryId || location.pathname === routes.index ? styles.active : '',
                )}
            >
                All
            </div>
            <div
                onClick={onClickGenres}
                className={classNames(
                    styles.tab,
                    (match?.params.genreId && match.params.categoryId) ||
                        (oneTrackMatch?.params.genreId && oneTrackMatch.params.categoryId)
                        ? styles.active
                        : '',
                )}
            >
                Genres
            </div>
        </div>
    );
};

export default observer(Switcher);
