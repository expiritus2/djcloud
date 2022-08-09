import React, { FC } from 'react';
import classNames from 'classnames';

import { BsShuffle } from 'react-icons/bs';
import { useStore } from 'store';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
};

const Shuffle: FC<ComponentProps> = (props) => {
    const { className } = props;
    const { tracks } = useStore();
    const isShuffleField = tracks.meta.shuffle === true;

    const onShuffle = () => {
        tracks.getAll({ limit: 100, shuffle: true, page: 0, field: undefined });
    };

    return (
        <div onClick={onShuffle} className={classNames(styles.shuffle, { [styles.active]: isShuffleField }, className)}>
            <span>Shuffle</span>
            <BsShuffle className={styles.icon} />
        </div>
    );
};

export default Shuffle;
