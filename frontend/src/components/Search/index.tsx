import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
}

const Search: FC<ComponentProps> = (props) => {
    const { className } = props;

    return (
        <div className={classNames(styles.search, className)}>
            <input className={styles.input} type="search" />
        </div>
    );
};

export default Search;