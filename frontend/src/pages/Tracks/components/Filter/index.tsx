import React, { FC, memo, MouseEventHandler, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useStore } from 'store';
import { Category, Genre } from 'types/track';

import { Archive, CategoryInput, GenreInput } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Filter: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const [categoryValue, setCategoryValue] = useState<Category | undefined>(undefined);
    const [genreValue, setGenreValue] = useState<Genre | undefined>(undefined);
    const [archiveActive, setArchiveActive] = useState<boolean>(false);

    const onChangeCategory: MouseEventHandler<HTMLSelectElement> = useCallback(
        (e: any) => {
            const val = e?.target?.value as Category;
            tracks.getAll({ categoryId: val?.id, page: 0 }, { silent: true }, (err: any) => {
                if (!err) {
                    setCategoryValue(val);
                }
            });
        },
        [tracks],
    );

    const onChangeGenre: MouseEventHandler<HTMLSelectElement> = useCallback(
        (e: any) => {
            const val = e?.target?.value as Genre;
            tracks.getAll({ genreId: val?.id, page: 0 }, { silent: true }, (err: any) => {
                if (!err) {
                    setGenreValue(val);
                }
            });
        },
        [tracks],
    );

    const onArchive: MouseEventHandler<HTMLDivElement> = useCallback(() => {
        const isArchive = !archiveActive;
        setArchiveActive(isArchive);
        tracks.getAll({ archive: isArchive ? isArchive : undefined }, { silent: true });
    }, [archiveActive, tracks]);

    return (
        <div className={classNames(styles.filter, className)}>
            <CategoryInput className={styles.category} onChange={onChangeCategory} value={categoryValue} />
            <GenreInput className={styles.genre} onChange={onChangeGenre} value={genreValue} />
            <Archive onClick={onArchive} active={archiveActive} className={styles.archive} />
        </div>
    );
};

export default memo(Filter);
