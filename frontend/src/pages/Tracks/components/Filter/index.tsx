import React, { FC, MouseEventHandler, useState } from 'react';
import classNames from 'classnames';
import { useScreen } from 'hooks';
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
    const { screen } = useScreen();
    const [categoryValue, setCategoryValue] = useState<Category | undefined>(undefined);
    const [genreValue, setGenreValue] = useState<Genre | undefined>(undefined);
    const [archiveActive, setArchiveActive] = useState<boolean>(false);

    const onChangeCategory: MouseEventHandler<HTMLSelectElement> = (e: any) => {
        const val = e?.target?.value as Category;
        tracks.getAll({ categoryId: val?.id, page: 0 }, { silent: true }, (err: any) => {
            if (!err) {
                setCategoryValue(val);
            }
        });
    };

    const onChangeGenre: MouseEventHandler<HTMLSelectElement> = (e: any) => {
        const val = e?.target?.value as Genre;
        tracks.getAll({ genreId: val?.id, page: 0 }, { silent: true }, (err: any) => {
            if (!err) {
                setGenreValue(val);
            }
        });
    };

    const onArchive: MouseEventHandler<HTMLDivElement> = () => {
        const isArchive = !archiveActive;
        setArchiveActive(isArchive);
        tracks.getAll({ archive: isArchive ? isArchive : undefined }, { silent: true });
    };

    return (
        <div className={classNames(styles.filter, className)}>
            <CategoryInput className={styles.category} onChange={onChangeCategory} value={categoryValue} />
            <GenreInput className={styles.genre} onChange={onChangeGenre} value={genreValue} />
            {screen.width > 450 && <Archive onClick={onArchive} active={archiveActive} className={styles.archive} />}
        </div>
    );
};

export default Filter;
