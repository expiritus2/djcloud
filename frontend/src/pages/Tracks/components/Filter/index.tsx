import React, { FC, useState } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { CategoryInput, GenreInput } from 'components';
import { Category, Genre } from 'types/track';
import { useStore } from '../../../../store';

type ComponentProps = {
    className?: string;
};

const Filter: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const [categoryValue, setCategoryValue] = useState<Category | undefined>(undefined);
    const [genreValue, setGenreValue] = useState<Genre | undefined>(undefined);

    const onChangeCategory = (e: any) => {
        const val = e?.target?.value as Category;
        tracks.getAll({ categoryId: val?.id }, { silent: true }, (err: any) => {
            if (!err) {
                setCategoryValue(val);
            }
        });
    };

    const onChangeGenre = (e: any) => {
        const val = e?.target?.value as Genre;
        tracks.getAll({ genreId: val?.id }, { silent: true }, (err: any) => {
            if (!err) {
                setGenreValue(val);
            }
        });
    };

    return (
        <div className={classNames(styles.filter, className)}>
            <CategoryInput onChange={onChangeCategory} value={categoryValue} />
            <GenreInput className={styles.genre} onChange={onChangeGenre} value={genreValue} />
        </div>
    );
};

export default Filter;
